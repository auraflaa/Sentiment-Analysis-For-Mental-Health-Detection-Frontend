import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Clock, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  Eye,
  Calendar,
  BarChart3,
  Trash2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PastAssessment {
  primaryCondition: string;
  confidence: number;
  allConditions?: { condition: string; confidence: number }[];
  recommendations?: string[];
  resources?: string[];
  severity?: 'low' | 'moderate' | 'high';
  timestamp: string;
}

const PastAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<PastAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<PastAssessment | null>(null);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Load past assessments from localStorage
    try {
      const history = JSON.parse(localStorage.getItem('resultsHistory') || '[]') as PastAssessment[];
      setAssessments([...history].reverse()); // Most recent first
    } catch (error) {
      console.error('Error loading past assessments:', error);
      setAssessments([]);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: "power3.out"
          }
        );
      }

      const cards = gsap.utils.toArray<HTMLElement>('.assessment-card');
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30, scale: 0.96, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            delay: index * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [assessments]);

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    // High confidence (80%+) = Good (green) - means assessment is reliable
    // Medium confidence (50-79%) = Moderate (yellow)
    // Low confidence (<50%) = Low (orange) - means assessment is less certain
    if (confidence >= 0.8) {
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    } else if (confidence >= 0.5) {
      return 'text-amber-600 bg-amber-50 border-amber-200';
    } else {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const handleDeleteAssessment = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const assessmentToDelete = assessments[index];
    if (window.confirm(`Delete this assessment?\n\nDate: ${new Date(assessmentToDelete.timestamp).toLocaleDateString()}\nPrimary Condition: ${assessmentToDelete.primaryCondition}\n\nThis action cannot be undone. Click OK to confirm deletion.`)) {
      try {
        const history = JSON.parse(localStorage.getItem('resultsHistory') || '[]') as PastAssessment[];
        // Reverse to get original order, remove item, reverse back
        const reversed = [...history].reverse();
        reversed.splice(index, 1);
        const updated = reversed.reverse();
        localStorage.setItem('resultsHistory', JSON.stringify(updated));
        setAssessments(reversed);
        // Clear selected if it was the deleted one
        if (selectedAssessment && selectedAssessment.timestamp === assessmentToDelete.timestamp) {
          setSelectedAssessment(null);
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
        alert('Unable to delete assessment.\n\nPlease try again. If the problem persists, please refresh the page.');
      }
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'moderate':
        return <TrendingUp className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (assessments.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="h-16 md:h-20" aria-hidden="true" />
        <section ref={sectionRef} className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h1 ref={titleRef} className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Past Assessments
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                You haven't completed any assessments yet.
              </p>
              <button
                onClick={() => navigate('/survey')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:-translate-y-1 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-2xl"
              >
                Take Your First Assessment
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="h-16 md:h-20" aria-hidden="true" />
      
      <section ref={sectionRef} className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 ref={titleRef} className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Past Assessments
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Review your previous mental health assessment results and track your progress over time.
            </p>
          </div>

          {/* Assessments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {assessments.map((assessment, index) => {
              const { date, time } = formatDate(assessment.timestamp);
              return (
                <div
                  key={index}
                  className="assessment-card card bg-stone-50 shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] hover:border-primary-300/60 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out border border-stone-200/60 cursor-pointer relative group"
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteAssessment(index, e)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10"
                    aria-label="Delete assessment"
                    title="Delete this assessment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(assessment.severity)}`}>
                        {getSeverityIcon(assessment.severity)}
                        <span className="capitalize">{assessment.severity || 'Unknown'} Severity</span>
                      </div>
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                      {assessment.primaryCondition}
                    </h3>

                    {/* Confidence display - improved with correct colors */}
                    <div className="mb-4">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium mb-2 ${getConfidenceColor(assessment.confidence || 0)}`}>
                        <BarChart3 className="w-4 h-4" />
                        <span>
                          {Math.round((assessment.confidence || 0) * 100)}% Assessment Confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic">
                        {assessment.confidence && assessment.confidence >= 0.8 
                          ? 'High confidence - Assessment is reliable'
                          : assessment.confidence && assessment.confidence >= 0.5
                          ? 'Moderate confidence - Assessment is reasonably certain'
                          : 'Lower confidence - Consider retaking assessment'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-200">
                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssessment(assessment);
                      }}
                      className="mt-4 w-full inline-flex items-center justify-center text-primary-600 hover:text-primary-700 hover:translate-x-1 font-medium text-sm transition-all duration-300 ease-out"
                    >
                      View Details
                      <Eye className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/survey')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-110 hover:-translate-y-1 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-2xl"
              >
                Take New Assessment
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 hover:scale-110 hover:-translate-y-1 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-2xl"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAssessment && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAssessment(null)}
        >
          <div 
            className="bg-stone-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                    {selectedAssessment.primaryCondition}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{formatDate(selectedAssessment.timestamp).date}</span>
                    <span>•</span>
                    <span>{formatDate(selectedAssessment.timestamp).time}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close assessment details"
                  title="Close"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={`card border ${getConfidenceColor(selectedAssessment.confidence || 0)}`}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-semibold">Assessment Confidence</span>
                    </div>
                    <p className="text-3xl font-bold mb-2">
                      {Math.round((selectedAssessment.confidence || 0) * 100)}%
                    </p>
                    <p className="text-xs text-slate-600">
                      {selectedAssessment.confidence && selectedAssessment.confidence >= 0.8 
                        ? 'High confidence - Reliable assessment'
                        : selectedAssessment.confidence && selectedAssessment.confidence >= 0.5
                        ? 'Moderate confidence - Reasonably certain'
                        : 'Lower confidence - Consider retaking'}
                    </p>
                  </div>
                </div>

                <div className={`card border ${getSeverityColor(selectedAssessment.severity)}`}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(selectedAssessment.severity)}
                      <span className="font-semibold">Condition Severity</span>
                    </div>
                    <p className="text-2xl font-bold capitalize mb-2">
                      {selectedAssessment.severity || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-600">
                      {selectedAssessment.severity === 'high' 
                        ? 'High severity - Seek professional help'
                        : selectedAssessment.severity === 'moderate'
                        ? 'Moderate severity - Monitor and consider support'
                        : 'Low severity - Continue self-care practices'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAssessment.allConditions && selectedAssessment.allConditions.length > 0 && (
                <div className="card bg-white/60 border border-stone-200/60 mb-6">
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-4">All Conditions Detected</h3>
                    <div className="space-y-2">
                      {selectedAssessment.allConditions.map((cond, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <span className="text-slate-700">{cond.condition}</span>
                          <span className="font-medium text-primary-600">
                            {Math.round(cond.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedAssessment.recommendations && selectedAssessment.recommendations.length > 0 && (
                <div className="card bg-white/60 border border-stone-200/60 mb-6">
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {selectedAssessment.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedAssessment.resources && selectedAssessment.resources.length > 0 && (
                <div className="card bg-white/60 border border-stone-200/60">
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-4">Suggested Resources</h3>
                    <ul className="space-y-2">
                      {selectedAssessment.resources.map((resource, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700">
                          <Brain className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span>{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PastAssessmentsPage;

