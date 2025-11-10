import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './Navbar';
import { gsap } from 'gsap';
import jsPDF from 'jspdf';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface SurveyResponse {
  questionId: number;
  answer: string;
  prediction?: {
    condition: string;
    confidence: number;
    keywords?: string[];
  };
}

interface FinalResult {
  primaryCondition: string;
  confidence: number;
  allConditions: { condition: string; confidence: number }[];
  recommendations: string[];
  resources: string[];
  severity: 'low' | 'moderate' | 'high';
  matchedKeywords?: { keyword: string; count: number }[];
  builtFromKeywords?: boolean;
}

const ResultsPage: React.FC = () => {
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  const calculateFinalResult = useCallback((responses: SurveyResponse[]): FinalResult => {
    // Group predictions by condition with weighted scoring
    const conditionScores: { [key: string]: { count: number; totalConfidence: number; maxConfidence: number } } = {};
    
    // Check for suicide-related keywords in responses
    const suicideKeywords = ['suicide', 'kill myself', 'end my life', 'not worth living', 'better off dead', 'want to die'];
    const keywordCounts: Record<string, number> = {};
    responses.forEach(r => {
      const kws = r.prediction?.keywords || [];
      kws.forEach(k => {
        const key = k.toLowerCase();
        keywordCounts[key] = (keywordCounts[key] || 0) + 1;
      });
    });
    // Identify suicide risk via flagged keywords first; fallback to text scan
    let hasSuicideRisk = Object.keys(keywordCounts).some(k => suicideKeywords.includes(k));
    if (!hasSuicideRisk) {
      const textHas = responses.some(r => suicideKeywords.some(k => (r.answer || '').toLowerCase().includes(k)));
      hasSuicideRisk = textHas;
    }

    responses.forEach(response => {
      if (response.prediction) {
        const condition = response.prediction.condition;
        const confidence = response.prediction.confidence;
        
        if (!conditionScores[condition]) {
          conditionScores[condition] = { count: 0, totalConfidence: 0, maxConfidence: 0 };
        }
        
        conditionScores[condition].count += 1;
        conditionScores[condition].totalConfidence += confidence;
        conditionScores[condition].maxConfidence = Math.max(conditionScores[condition].maxConfidence, confidence);
      }
    });

    // Calculate weighted scores (majority + confidence + max confidence)
    // Condition priors to overweight clinically significant classes
    const conditionWeightMap: Record<string, number> = {
      'Depression': 1.25,
      'Anxiety': 1.15,
      'Stress': 1.0,
      'Suicide Risk': 1.5,
      'Normal': 0.75
    };

    let builtFromKeywords = false;
    let allConditions = Object.keys(conditionScores).map(condition => {
      const data = conditionScores[condition];
      const avgConfidence = data.totalConfidence / data.count;
      const majorityWeight = data.count / responses.length; // How many questions predicted this
      const confidenceWeight = avgConfidence; // Average confidence
      const maxConfidenceWeight = data.maxConfidence; // Highest single confidence
      
      // Weighted score: 40% majority, 30% avg confidence, 30% max confidence
      let weightedScore = (majorityWeight * 0.4) + (confidenceWeight * 0.3) + (maxConfidenceWeight * 0.3);
      // Apply class prior weight
      const prior = conditionWeightMap[condition] ?? 1.0;
      weightedScore *= prior;
      
      return {
        condition,
        confidence: weightedScore,
        rawConfidence: avgConfidence,
        count: data.count
      };
    }).sort((a, b) => b.confidence - a.confidence);

    // Fallback: if model returned nothing usable, try building from flagged keywords
    if (allConditions.length === 0) {
      const entries = Object.entries(keywordCounts);
      if (entries.length > 0) {
        const total = entries.reduce((sum, [, c]) => sum + c, 0);
        allConditions = entries
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([k, c]) => ({ condition: k, confidence: Math.max(0.05, c / total) } as any));
        builtFromKeywords = true;
      } else {
        allConditions = [{ condition: 'Normal', confidence: 1 } as any];
      }
    }

    // If suicide risk detected, prioritize it regardless of other conditions
    let primaryCondition = allConditions[0]?.condition || 'Unknown';
    let confidence = allConditions[0]?.confidence || 0;
    
    if (hasSuicideRisk) {
      primaryCondition = 'Suicide Risk';
      confidence = Math.max(0.95, confidence);
      // Put suicide risk at the front if not already
      if (!allConditions.find(c => (c as any).condition === 'Suicide Risk')) {
        allConditions.unshift({ condition: 'Suicide Risk', confidence: confidence, rawConfidence: confidence, count: 1 } as any);
      } else {
        allConditions = [{ condition: 'Suicide Risk', confidence, rawConfidence: confidence, count: 1 } as any, ...allConditions.filter(c => (c as any).condition !== 'Suicide Risk')];
      }
    }

    // POINT SYSTEM (requested): suicidal >> depression/anxiety >> normal
    // Base points
    const POINTS = {
      suicidal: 12, // highest priority
      depression: 3, // 3:1 vs Normal
      anxiety: 3,    // 3:1 vs Normal
      normal: 1,
      stress: 1
    } as const;

    // Aggregate points across responses
    const pointTotals: Record<string, { points: number; totalConfidence: number; count: number }> = {};
    const addPoints = (label: string, pts: number, conf: number) => {
      if (!pointTotals[label]) pointTotals[label] = { points: 0, totalConfidence: 0, count: 0 };
      pointTotals[label].points += pts;
      pointTotals[label].totalConfidence += conf;
      pointTotals[label].count += 1;
    };

    responses.forEach(r => {
      const cond = (r.prediction?.condition || 'Unknown').toLowerCase();
      const conf = r.prediction?.confidence ?? 0;
      if (r.prediction?.keywords?.some(k => ['suicide','kill myself','end my life','not worth living','better off dead','want to die'].includes(k.toLowerCase()))) {
        addPoints('Suicide Risk', POINTS.suicidal, Math.max(conf, 0.95));
        return;
      }
      if (cond.includes('depress')) addPoints('Depression', POINTS.depression, conf);
      else if (cond.includes('anx')) addPoints('Anxiety', POINTS.anxiety, conf);
      else if (cond.includes('stress')) addPoints('Stress', POINTS.stress, conf);
      else if (cond.includes('normal')) addPoints('Normal', POINTS.normal, conf);
    });

    // If suicide keywords detected anywhere, ensure points reflect that even if above loop missed
    if (hasSuicideRisk && !pointTotals['Suicide Risk']) {
      addPoints('Suicide Risk', POINTS.suicidal, 0.95);
    }

    // Choose by highest points, tie-break by avg confidence
    if (Object.keys(pointTotals).length > 0) {
      const ranked = Object.entries(pointTotals)
        .map(([k, v]) => {
          const avgConf = v.totalConfidence / Math.max(1, v.count);
          const occ = v.count; // occurrence count
          // Composite score: points + confidence + occurrence
          // Weighting: points (base), avgConf (x2), occurrence (x0.5)
          const composite = v.points + (avgConf * 2) + (occ * 0.5);
          return { condition: k, points: v.points, avgConf, occ, composite };
        })
        .sort((a, b) => b.composite - a.composite || b.avgConf - a.avgConf || b.points - a.points);

      primaryCondition = ranked[0].condition;
      confidence = Math.max(confidence, ranked[0].avgConf || 0.8);

      // Rebuild allConditions view proportionally to composite to align with new logic
      const totalComposite = ranked.reduce((s, r) => s + r.composite, 0) || 1;
      allConditions = ranked.map(r => ({ condition: r.condition, confidence: r.composite / totalComposite } as any));
    }

    // Determine severity with special handling for suicide risk
    let severity: 'low' | 'moderate' | 'high' = 'low';
    if (primaryCondition === 'Suicide Risk' || hasSuicideRisk || confidence > 0.85) {
      severity = 'high';
    } else if (confidence > 0.5) {
      severity = 'moderate';
    }

    // Generate recommendations based on condition and suicide risk
    const recommendations = generateRecommendations(primaryCondition, severity, hasSuicideRisk);
    const resources = generateResources(primaryCondition, hasSuicideRisk);

    const result: FinalResult = {
      primaryCondition,
      confidence,
      allConditions,
      recommendations,
      resources,
      severity,
      matchedKeywords: Object.keys(keywordCounts).map(k => ({ keyword: k, count: keywordCounts[k] })),
      builtFromKeywords
    };

    setFinalResult(result);
    // Save history entry
    try {
      const history = JSON.parse(localStorage.getItem('resultsHistory') || '[]');
      history.push({ ...result, timestamp: new Date().toISOString() });
      localStorage.setItem('resultsHistory', JSON.stringify(history.slice(-10))); // keep last 10
    } catch (_) {}
    setIsLoading(false);
    return result;
  }, []);

  useEffect(() => {
    // Always start at top on refresh/navigation
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Load responses from localStorage
    const savedResponses = localStorage.getItem('surveyResponses');
    if (savedResponses) {
      const parsedResponses = JSON.parse(savedResponses);
      calculateFinalResult(parsedResponses);
    } else {
      // Redirect to survey if no responses
      window.location.href = '/survey';
    }
  }, [calculateFinalResult]);

  useEffect(() => {
    if (!resultsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(resultsRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      const items = gsap.utils.toArray<HTMLElement>('.reveal');
      gsap.set(items, { opacity: 0, y: 24 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.15
      });
    }, resultsRef);
    return () => ctx.revert();
  }, [finalResult]);

  const generateRecommendations = (condition: string, severity: string, hasSuicideRisk: boolean = false): string[] => {
    if (hasSuicideRisk) {
      return [
        "🚨 IMMEDIATE ACTION REQUIRED: Contact emergency services or crisis hotline immediately",
        "Call Vandrevala Foundation Helpline: 1860-2662-345 or 1800-2333-330",
        "Call Emergency Services: 102 (Ambulance) or 112 (Emergency)",
        "Go to your nearest emergency room or hospital",
        "Stay with a trusted friend or family member",
        "Remove any means of self-harm from your environment",
        "Speak with a mental health professional as soon as possible"
      ];
    }

    const baseRecommendations = [
      "Consider speaking with a mental health professional",
      "Practice regular self-care activities",
      "Maintain a consistent sleep schedule",
      "Engage in physical exercise regularly",
      "Connect with supportive friends and family"
    ];

    const conditionSpecific = {
      'Depression': [
        "Consider cognitive behavioral therapy (CBT)",
        "Try to maintain a daily routine",
        "Expose yourself to natural sunlight daily",
        "Consider medication evaluation with a psychiatrist"
      ],
      'Anxiety': [
        "Practice deep breathing exercises",
        "Try mindfulness meditation",
        "Consider exposure therapy for specific fears",
        "Limit caffeine and alcohol intake"
      ],
      'Stress': [
        "Identify and address stress triggers",
        "Practice time management techniques",
        "Learn relaxation techniques like progressive muscle relaxation",
        "Consider stress management therapy"
      ],
      'Suicide Risk': [
        "🚨 IMMEDIATE ACTION REQUIRED: Contact emergency services or crisis hotline immediately",
        "Call Vandrevala Foundation Helpline: 1860-2662-345 or 1800-2333-330",
        "Call Emergency Services: 102 (Ambulance) or 112 (Emergency)",
        "Go to your nearest emergency room or hospital"
      ]
    };

    return [
      ...baseRecommendations,
      ...(conditionSpecific[condition as keyof typeof conditionSpecific] || [])
    ];
  };

  const generateResources = (condition: string, hasSuicideRisk: boolean = false): string[] => {
    // Only return resources when condition is not normal/unknown
    const normalized = (condition || '').toLowerCase();
    if (normalized === 'normal' || normalized === 'unknown') return [];

    if (hasSuicideRisk || normalized === 'suicide risk') {
      return [
        '🚨 Vandrevala Foundation Helpline: 1860-2662-345 or 1800-2333-330',
        '🚨 Emergency Services: 102 (Ambulance) or 112 (Emergency)',
        'NIMHANS Emergency: +91-80-2699-5500',
        'Find a crisis center near you (local services)'
      ];
    }

    const byCondition: Record<string, string[]> = {
      depression: [
        'NIMHANS – Mental Health Resources',
        'YourDOST – Online Counseling',
        'The Live Love Laugh Foundation',
        'Find a therapist near you'
      ],
      anxiety: [
        'Wysa – AI Mental Health Support',
        'Amaha (formerly InnerHour) – Self-help tools',
        'Breathing exercises and mindfulness',
        'Find a CBT therapist in India'
      ],
      stress: [
        'Stress management resources',
        'Progressive muscle relaxation guide',
        'Sleep hygiene tips',
        'Community support groups'
      ]
    };

    return byCondition[normalized] || [
      'The Live Love Laugh Foundation – Help & Support',
      'Find a licensed therapist in India',
      'Local community mental health services'
    ];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'moderate': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'High Priority';
      case 'moderate': return 'Moderate Attention';
      case 'low': return 'Low Priority';
      default: return 'Unknown';
    }
  };


  // Build chart data with safe minimums so the pie is never invisible
  let chartData = (finalResult?.allConditions || []).map(condition => {
    const pct = Math.round((condition as any).confidence * 100);
    const value = Math.max(5, pct); // ensure visible slice
    const name = (condition as any).condition;
    const fill = name === 'Suicide Risk' ? '#EF4444'
      : name === 'Depression' ? '#8B5CF6'
      : name === 'Anxiety' ? '#10B981'
      : name === 'Stress' ? '#F59E0B'
      : '#6B7280';
    return { name, value, confidence: (condition as any).confidence, fill };
  });
  if (!chartData || chartData.length === 0) {
    if (finalResult) {
      const fallbackPct = Math.max(5, Math.round(finalResult.confidence * 100) || 100);
      chartData = [{ name: finalResult.primaryCondition || 'Normal', value: fallbackPct, confidence: finalResult.confidence, fill: '#3B82F6' }];
    } else {
      chartData = [];
    }
  }


const PastAssessments: React.FC = () => {
  try {
    const history = JSON.parse(localStorage.getItem('resultsHistory') || '[]') as Array<any>;
    if (!history.length) return <p className="text-white/60">No previous assessments yet.</p>;
    const items = [...history].reverse().slice(0, 5);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{item.primaryCondition || 'Unknown'}</div>
              <div className="text-white/70 text-sm">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
            <div className="text-white/70 text-sm mt-1">Confidence: {Math.round((item.confidence || 0) * 100)}%</div>
          </div>
        ))}
      </div>
    );
  } catch (_) {
    return <p className="text-white/60">No previous assessments yet.</p>;
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Results</h2>
          <p className="text-white/80">Please wait while we process your assessment...</p>
        </div>
      </div>
    );
  }

  if (!finalResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-2">Unable to Process Results</h2>
          <p className="text-white/80 mb-6">There was an error processing your assessment.</p>
          <button 
            onClick={() => window.location.href = '/survey'}
            className="btn-primary"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <Navbar />
      {/* Spacer to offset fixed navbar height */}
      <div className="h-16 md:h-20" aria-hidden="true" />

      {/* Intro Overlay while analysis loads (black monochrome) */}
      {isLoading && (
        <div ref={introRef} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white">
          <div className="text-center px-6">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">Your story matters.</h1>
            <p className="text-white/80 text-lg md:text-xl">We’re preparing your results…</p>
          </div>
        </div>
      )}

      {/* No separate hero section; we reveal dashboard after loader */}

      {/* Header removed on results page as requested */}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-10 pb-14 md:pt-16 md:pb-16">
        <div ref={resultsRef} className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-12 reveal">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Mental Health Assessment
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Based on your responses, here's what we found and our recommendations for you.
            </p>
          </div>

          {/* Primary Result */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="card bg-slate-800/60 backdrop-blur-sm border border-white/10 text-white reveal hover:bg-slate-800/80 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-3 text-red-500" />
                Primary Assessment
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white/80 mb-2">Condition</h3>
                  <div className="text-3xl font-bold text-white mb-3">
                    {finalResult.primaryCondition}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    finalResult.confidence >= 0.8 
                      ? 'text-emerald-300 bg-emerald-500/20 border-emerald-400/40'
                      : finalResult.confidence >= 0.5
                      ? 'text-amber-300 bg-amber-500/20 border-amber-400/40'
                      : 'text-orange-300 bg-orange-500/20 border-orange-400/40'
                  }`}>
                    <BarChart3 className="w-4 h-4" />
                    <span>Assessment Confidence: {Math.round(finalResult.confidence * 100)}%</span>
                  </div>
                  <p className="text-xs text-white/60 mt-2 italic">
                    {finalResult.confidence >= 0.8 
                      ? 'High confidence - Reliable assessment'
                      : finalResult.confidence >= 0.5
                      ? 'Moderate confidence - Reasonably certain'
                      : 'Lower confidence - Consider retaking'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white/80 mb-2">Priority Level</h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getSeverityColor(finalResult.severity)}`}>
                    {getSeverityText(finalResult.severity)}
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Chart */}
            <div className="card bg-slate-800/60 backdrop-blur-sm border border-white/10 text-white reveal hover:bg-slate-800/80 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
                Key Signals
              </h2>
              {finalResult.matchedKeywords && finalResult.matchedKeywords.length > 0 ? (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
                    {finalResult.matchedKeywords.map(({ keyword, count }) => (
                      <span key={keyword} className="px-2.5 py-1 rounded-full text-xs bg-red-500/20 text-red-200 border border-red-400/30">
                        {keyword} ×{count}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center text-white/60">
                  <p className="text-sm">No flagged words returned by the model.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations & Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="card bg-slate-800/60 backdrop-blur-sm border border-white/10 text-white reveal hover:bg-slate-800/80 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                Recommendations
              </h2>
              
              <ul className="space-y-3">
                {finalResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/85">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {finalResult.resources.length > 0 && (
              <div className="card bg-slate-800/60 backdrop-blur-sm border border-white/10 text-white reveal hover:bg-slate-800/80 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-yellow-500" />
                  Resources
                </h2>
                <ul className="space-y-3">
                  {finalResult.resources.map((resource, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/85">{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center reveal">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/survey'}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-110 hover:-translate-y-1 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-lg shadow-lg hover:shadow-2xl inline-flex items-center"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Retake Assessment
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 hover:scale-110 hover:-translate-y-1 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 text-lg shadow-lg hover:shadow-2xl"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Past Assessments */}
          <div className="mt-12 reveal">
            <h2 className="text-2xl font-bold text-white mb-4">Past Assessments</h2>
            <PastAssessments />
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-yellow-900/20 border border-yellow-700/40 rounded-lg reveal">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-300 mb-2">Important Disclaimer</h3>
                <p className="text-yellow-200 text-sm leading-relaxed">
                  This assessment is for educational and awareness purposes only. It is not a substitute for 
                  professional medical advice, diagnosis, or treatment. If you're experiencing a mental health 
                  crisis, please contact emergency services or a crisis hotline immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
