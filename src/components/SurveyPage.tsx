import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useForm } from 'react-hook-form';
import { gsap } from 'gsap';
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Shield,
  Loader2,
  Clock,
  X
} from 'lucide-react';

interface SurveyQuestion {
  id: number;
  question: string;
  type: 'text' | 'textarea';
  placeholder: string;
  required: boolean;
  category: string;
}

interface SurveyResponse {
  questionId: number;
  answer: string;
  prediction?: {
    condition: string;
    confidence: number;
    keywords?: string[];
  };
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    question: "How would you describe your overall mood today?",
    type: "text",
    placeholder: "Please describe how you're feeling right now...",
    required: true,
    category: "mood"
  },
  {
    id: 2,
    question: "What thoughts have been occupying your mind recently?",
    type: "textarea",
    placeholder: "Share what's been on your mind, any worries, concerns, or positive thoughts...",
    required: true,
    category: "thoughts"
  },
  {
    id: 3,
    question: "How has your sleep been lately?",
    type: "textarea",
    placeholder: "Describe your sleep patterns, any difficulties falling asleep, staying asleep, or feeling rested...",
    required: true,
    category: "sleep"
  },
  {
    id: 4,
    question: "What activities or hobbies do you enjoy?",
    type: "textarea",
    placeholder: "Tell us about things that bring you joy, your interests, or activities you find fulfilling...",
    required: true,
    category: "interests"
  },
  {
    id: 5,
    question: "How do you handle stress and difficult situations?",
    type: "textarea",
    placeholder: "Describe your coping mechanisms, how you deal with challenges, or what helps you through tough times...",
    required: true,
    category: "coping"
  },
  {
    id: 6,
    question: "What are your relationships like with family and friends?",
    type: "textarea",
    placeholder: "Share about your social connections, support system, or any relationship challenges...",
    required: true,
    category: "relationships"
  },
  {
    id: 7,
    question: "How do you feel about your work or daily responsibilities?",
    type: "textarea",
    placeholder: "Describe your work life, daily tasks, or any pressures you're experiencing...",
    required: true,
    category: "work"
  },
  {
    id: 8,
    question: "Is there anything else you'd like to share about your mental health?",
    type: "textarea",
    placeholder: "Any additional thoughts, concerns, or experiences you'd like to discuss...",
    required: false,
    category: "additional"
  }
];

const SurveyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const isMountedRef = useRef(true);
  const clientRef = useRef<any>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const currentAnswer = watch(`question_${surveyQuestions[currentStep]?.id}`);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const consentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    if (consentRef.current) {
      gsap.fromTo(consentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (questionRef.current) {
      gsap.fromTo(questionRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [currentStep]);

  const getClient = async () => {
    if (clientRef.current) return clientRef.current;
    const { Client } = await import('@gradio/client');
    clientRef.current = await Client.connect("ourafla/Mental-Health-Detection-Model-Interface");
    return clientRef.current;
  };

  const analyzeResponse = async (text: string): Promise<{ condition: string; confidence: number; keywords?: string[] }> => {
    try {
      const client = await getClient();
      const predictionPromise = client.predict("/analyze_text", { text });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000));
      const result: any = await Promise.race([predictionPromise, timeoutPromise]);
      
      // Parse the HTML response to extract prediction and confidence
      const dataArr = result.data as any[];
      const htmlContent = String(dataArr?.[0] ?? '');
      const rawKeywords = String(dataArr?.[1] ?? '');
      const conditionMatch = htmlContent.match(/<b>Prediction:<\/b>\s*([^<]+)/);
      const confidenceMatch = htmlContent.match(/<b>Confidence:<\/b>\s*([0-9.]+)/);
      const keywords = rawKeywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      return {
        condition: conditionMatch ? conditionMatch[1].trim() : 'Unknown',
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0,
        keywords
      };
    } catch (error) {
      console.error('Error analyzing response:', error);
      return { condition: 'Analysis Error', confidence: 0 };
    }
  };

  const handleNext = async () => {
    const currentQuestion = surveyQuestions[currentStep];
    const isLast = currentStep === surveyQuestions.length - 1;
    const isRequired = currentQuestion.required;
    const hasAnswer = Boolean(currentAnswer && String(currentAnswer).trim());

    // If user skipped the last optional question, finalize without analysis
    if (!hasAnswer && isLast && !isRequired) {
      localStorage.setItem('surveyResponses', JSON.stringify(responses));
      window.location.href = '/results';
      return;
    }

    if (hasAnswer) {
      // Analyze the response
      setIsAnalyzing(true);
      try {
        const prediction = await analyzeResponse(currentAnswer);

        const newResponse: SurveyResponse = {
          questionId: currentQuestion.id,
          answer: currentAnswer,
          prediction
        };

        const updated = [...responses, newResponse];
        setResponses(updated);

        if (!isLast) {
          setCurrentStep(prev => prev + 1);
          reset();
        } else {
          localStorage.setItem('surveyResponses', JSON.stringify(updated));
          window.location.href = '/results';
        }
      } catch (error) {
        console.error('Error processing response:', error);
        alert('Unable to process your response.\n\nPlease check your internet connection and try again. If the problem persists, please refresh the page.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const previousStep = currentStep - 1;
      setCurrentStep(previousStep);
      
      // Find the previous response and set it in the form
      const previousResponse = responses.find(r => r.questionId === surveyQuestions[previousStep].id);
      if (previousResponse) {
        reset({
          [`question_${surveyQuestions[previousStep].id}`]: previousResponse.answer
        });
      } else {
        reset();
      }
    }
  };

  const handleConsent = () => {
    setConsentGiven(true);
    setShowConsent(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Only handle Enter key
    if (e.key !== 'Enter') return;
    
    // For textareas, allow Shift+Enter to create new lines
    // Only submit on Enter alone (without Shift)
    if (e.currentTarget.tagName === 'TEXTAREA' && e.shiftKey) {
      return; // Allow Shift+Enter for new lines
    }
    
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Don't proceed if form is disabled or required field is empty
    const currentQuestion = surveyQuestions[currentStep];
    const hasAnswer = Boolean(currentAnswer && String(currentAnswer).trim());
    const isRequired = currentQuestion.required;
    
    if (isAnalyzing || (isRequired && !hasAnswer)) {
      return;
    }
    
    // Trigger the next/submit action
    handleNext();
  };

  const progress = ((currentStep + 1) / surveyQuestions.length) * 100;

  if (showConsent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div ref={consentRef} className="max-w-2xl w-full relative">
          <div className="card bg-stone-50/95 backdrop-blur-sm border border-stone-200/60 relative">
            {/* Exit Button */}
            <Link
              to="/"
              className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-md hover:shadow-lg"
              title="Exit and return to home"
              aria-label="Exit consent screen"
            >
              <X className="w-5 h-5" />
            </Link>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Privacy & Consent
              </h1>
              <p className="text-gray-600 text-lg">
                Before we begin, please review our privacy policy and consent to data processing.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Important Information
              </h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• This assessment is for educational and awareness purposes only</li>
                <li>• It is not a substitute for professional medical advice or diagnosis</li>
                <li>• Your responses are processed locally and securely</li>
                <li>• No personal data is stored on our servers</li>
                <li>• Results are not shared with third parties</li>
              </ul>
            </div>

            <div className="space-y-4">
              <label 
                htmlFor="consent-checkbox"
                className="flex items-start space-x-3 cursor-pointer group"
                style={{ cursor: 'pointer' }}
              >
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    id="consent-checkbox"
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => {
                      console.log('Checkbox changed:', e.target.checked);
                      setConsentGiven(e.target.checked);
                    }}
                    className="w-6 h-6 text-primary-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all duration-200 hover:border-primary-400 hover:scale-110"
                    style={{ 
                      accentColor: '#6366f1',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 100
                    }}
                  />
                </div>
                <span 
                  className="text-slate-700 group-hover:text-slate-800 transition-colors duration-200 select-none cursor-pointer flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setConsentGiven(!consentGiven);
                  }}
                >
                  I understand that this is not a medical diagnosis and agree to the terms above.
                </span>
              </label>
            </div>

            <div className="flex flex-col items-center gap-4 mt-8">
              <button
                onClick={handleConsent}
                disabled={!consentGiven}
                className={`btn-primary text-lg px-8 py-4 ${
                  !consentGiven ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                I Agree - Start Assessment
              </button>
              <Link
                to="/past-assessments"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors duration-300"
              >
                <Clock className="w-4 h-4" />
                View Past Assessment Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Navbar />
      {/* Spacer to offset fixed navbar height */}
      <div className="h-16 md:h-20" aria-hidden="true" />
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Mental Health Assessment</h1>
            <div className="text-white/80">
              Question {currentStep + 1} of {surveyQuestions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div ref={progressRef} className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 pb-12 md:pt-12">
        <div ref={questionRef} className="max-w-4xl mx-auto">
          <div className="card bg-stone-50/95 backdrop-blur-sm border border-stone-200/60">
            {/* Question Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentStep + 1}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {surveyQuestions[currentStep].question}
                  </h2>
                  <p className="text-gray-600">
                    {surveyQuestions[currentStep].required ? 'Required' : 'Optional'}
                  </p>
                </div>
              </div>
            </div>

            {/* Question Input */}
            <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
              <div>
                {surveyQuestions[currentStep].type === 'textarea' ? (
                  <textarea
                    {...register(`question_${surveyQuestions[currentStep].id}`, {
                      required: surveyQuestions[currentStep].required,
                      minLength: 10
                    })}
                    onKeyDown={handleKeyDown}
                    placeholder={surveyQuestions[currentStep].placeholder}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-300"
                    style={{ cursor: 'text', pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                    autoFocus
                  />
                ) : (
                  <input
                    {...register(`question_${surveyQuestions[currentStep].id}`, {
                      required: surveyQuestions[currentStep].required,
                      minLength: 5
                    })}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder={surveyQuestions[currentStep].placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    style={{ cursor: 'text', pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                    autoFocus
                  />
                )}
                
                {errors[`question_${surveyQuestions[currentStep].id}`] && (
                  <p className="text-red-500 text-sm mt-2">
                    {surveyQuestions[currentStep].type === 'textarea' 
                      ? 'Please provide at least 10 characters' 
                      : 'Please provide at least 5 characters'
                    }
                  </p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ease-out ${
                    currentStep === 0 
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                      : 'bg-stone-200 text-slate-700 hover:bg-stone-300 hover:scale-105 hover:-translate-y-0.5'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  disabled={(surveyQuestions[currentStep].required && !currentAnswer) || isAnalyzing}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg transition-all duration-300 ${
                    (surveyQuestions[currentStep].required && !currentAnswer) || isAnalyzing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentStep === surveyQuestions.length - 1 ? 'Complete' : 'Next'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="mt-8 card bg-blue-50 border-blue-200">
              <div className="flex items-center justify-center space-x-3 text-blue-700">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg font-medium">We are thinking about you...</span>
              </div>
              <p className="text-center text-blue-600 mt-2">
                Analyzing your response to provide personalized insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
