import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import { AlertTriangle, Heart, Shield, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Disclaimer: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll('.disclaimer-section');
      gsap.set(sections, { opacity: 0, y: 30 });
      
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section as HTMLElement,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power2.out'
            });
          }
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="h-16 md:h-20" aria-hidden="true" />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 disclaimer-section">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-6">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Medical Disclaimer
            </h1>
            <p className="text-lg text-gray-600">
              Important information about the use of this platform
            </p>
          </div>

          {/* Critical Warning */}
          <div className="card bg-red-50 border-red-300 mb-8 disclaimer-section">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-3">Critical Warning</h2>
                <p className="text-red-700 leading-relaxed font-semibold text-lg mb-2">
                  This platform is for educational and awareness purposes only. It is NOT a substitute for 
                  professional medical advice, diagnosis, or treatment.
                </p>
                <p className="text-red-700 leading-relaxed">
                  If you are experiencing a mental health crisis or having thoughts of self-harm, please 
                  contact emergency services or a crisis hotline immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Not Medical Advice */}
          <div className="card bg-white mb-8 disclaimer-section">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">Not Medical Advice</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Mental Health Assessment Platform provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Educational information about mental health</li>
                <li>Self-assessment tools for awareness purposes</li>
                <li>General resources and information</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-semibold mt-4">
                This platform does NOT provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Medical diagnoses or professional mental health evaluations</li>
                <li>Treatment recommendations or medical advice</li>
                <li>Substitute for consultation with qualified healthcare professionals</li>
                <li>Emergency mental health services</li>
              </ul>
            </div>
          </div>

          {/* Assessment Limitations */}
          <div className="card bg-white mb-8 disclaimer-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Assessment Limitations</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The mental health assessments provided on this platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Are based on self-reported information and AI analysis</li>
                <li>Are not clinical evaluations or professional diagnoses</li>
                <li>May not be accurate or complete</li>
                <li>Should not be used as the sole basis for making healthcare decisions</li>
                <li>Are intended for educational and awareness purposes only</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                The AI model used for analysis is a tool for pattern recognition and should not be considered 
                a replacement for professional clinical judgment.
              </p>
            </div>
          </div>

          {/* When to Seek Professional Help */}
          <div className="card bg-blue-50 border-blue-200 mb-8 disclaimer-section">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">When to Seek Professional Help</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You should consult with a qualified healthcare professional if you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Are experiencing persistent feelings of sadness, anxiety, or hopelessness</li>
                <li>Have thoughts of self-harm or suicide</li>
                <li>Are experiencing significant changes in sleep, appetite, or energy levels</li>
                <li>Have difficulty functioning in daily life</li>
                <li>Are using substances to cope with emotional distress</li>
                <li>Have concerns about your mental health that are affecting your relationships or work</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                Remember: Seeking professional help is a sign of strength, not weakness.
              </p>
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="card bg-red-50 border-red-200 mb-8 disclaimer-section">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-800">Emergency Resources</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed font-semibold">
                If you are in immediate danger or experiencing a mental health crisis:
              </p>
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-bold text-lg text-red-600 mb-1">Vandrevala Foundation Helpline</p>
                  <p className="text-gray-700">Call <strong>1860-2662-345</strong> or <strong>1800-2333-330</strong> (available 24/7 in India)</p>
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        'Call Vandrevala Foundation Helpline?\n\nPhone: 1860-2662-345\n\nThis will open your phone dialer. Click OK to continue.'
                      );
                      if (confirmed) {
                        window.location.href = 'tel:18602662345';
                      }
                    }}
                    className="text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Call 1860-2662-345
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg text-red-600 mb-1">Emergency Services</p>
                  <p className="text-gray-700">Call <strong>102</strong> (Ambulance) or <strong>112</strong> (Emergency) for immediate assistance</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-red-600 mb-1">NIMHANS Emergency</p>
                  <p className="text-gray-700">Call <strong>+91-80-2699-5500</strong> for mental health emergencies</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-red-600 mb-1">International Support</p>
                  <p className="text-gray-700 mb-2">Find helplines in your country:</p>
                  <a 
                    href="https://findahelpline.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1"
                  >
                    Find A Helpline (Global Directory)
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* No Liability */}
          <div className="card bg-white mb-8 disclaimer-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Liability</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By using this platform, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>The platform and its assessments are provided "as is" without warranties of any kind</li>
                <li>We are not liable for any decisions made based on information from this platform</li>
                <li>We are not responsible for any consequences resulting from the use or misuse of this platform</li>
                <li>You assume full responsibility for your use of the platform</li>
                <li>You will not hold the platform, its creators, or contributors liable for any outcomes</li>
              </ul>
            </div>
          </div>

          {/* Data Privacy */}
          <div className="card bg-white mb-8 disclaimer-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Data Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your assessment responses are stored locally in your browser and are not transmitted to our 
              servers. However, you should be aware that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Local storage can be accessed by anyone with access to your device</li>
              <li>You should clear your browser's local storage if you share your device</li>
              <li>We use third-party AI services for analysis, which may process your responses</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              For more information, please review our <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</Link>.
            </p>
          </div>

          {/* Acceptance */}
          <div className="card bg-yellow-50 border-yellow-200 mb-8 disclaimer-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Acceptance of Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              By using this platform, you acknowledge that you have read, understood, and agree to this 
              disclaimer. You understand that this platform is for educational purposes only and is not a 
              substitute for professional medical care.
            </p>
          </div>

          {/* Additional Resources */}
          <div className="card bg-white mb-8 disclaimer-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Additional Resources</h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                For more information about our policies and terms:
              </p>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1">
                    Privacy Policy
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1">
                    Terms of Service
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Disclaimer;

