import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll('.policy-section');
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
          <div className="text-center mb-12 policy-section">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="card bg-white mb-8 policy-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Mental Health Assessment Platform, we are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, use, 
              and safeguard your data when you use our platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This platform is designed with privacy as a core principle. We believe that mental health 
              assessments should be conducted in a safe, private, and secure environment.
            </p>
          </div>

          {/* Data Collection */}
          <div className="card bg-white mb-8 policy-section">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">Data Collection</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Information You Provide</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you use our assessment tool, you may provide:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
                  <li>Responses to mental health assessment questions</li>
                  <li>Assessment results and history (stored locally in your browser)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may automatically collect certain technical information, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Usage patterns and interactions with the platform</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Storage */}
          <div className="card bg-white mb-8 policy-section">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">Data Storage & Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Local Storage</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your assessment responses and results are stored locally in your browser using localStorage. 
                  This means:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
                  <li>Your data never leaves your device</li>
                  <li>We do not have access to your personal responses</li>
                  <li>You can clear your data at any time by clearing your browser's local storage</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Server-Side Storage</h3>
                <p className="text-gray-700 leading-relaxed">
                  We do not store your assessment responses, results, or any personally identifiable information 
                  on our servers. All processing happens locally in your browser or through secure API calls 
                  that do not retain your data.
                </p>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="card bg-white mb-8 policy-section">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">How We Use Your Data</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide you with mental health assessments and personalized insights</li>
                <li>Improve our platform's functionality and user experience</li>
                <li>Analyze usage patterns to enhance our services (aggregated, anonymized data only)</li>
                <li>Ensure platform security and prevent abuse</li>
              </ul>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="card bg-white mb-8 policy-section">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">Data Sharing & Disclosure</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Legal Requirements:</strong> If required by law or in response to valid legal process</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in 
                  operating our platform (under strict confidentiality agreements)</li>
                <li><strong>Safety Concerns:</strong> If we believe disclosure is necessary to protect the safety 
                  of users or the public</li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="card bg-white mb-8 policy-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Privacy Rights</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Access your assessment history (stored locally in your browser)</li>
                <li>Delete your assessment data at any time by clearing your browser's local storage</li>
                <li>Opt out of any data collection by not using the platform</li>
                <li>Request information about what data we have collected (if any)</li>
              </ul>
            </div>
          </div>

          {/* Cookies */}
          <div className="card bg-white mb-8 policy-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Cookies & Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use minimal cookies and tracking technologies to improve your experience. These may include 
              session cookies for functionality and analytics cookies (anonymized). You can control cookie 
              preferences through your browser settings.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="card bg-white mb-8 policy-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for children under the age of 13. We do not knowingly collect 
              personal information from children. If you believe we have inadvertently collected information 
              from a child, please contact us immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="card bg-white mb-8 policy-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant 
              changes by posting the new policy on this page and updating the "Last updated" date. We 
              encourage you to review this policy periodically.
            </p>
          </div>

          {/* Contact */}
          <div className="card bg-blue-50 border-blue-200 mb-8 policy-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> <a href="mailto:priyangshumukherjee07@gmail.com" className="text-primary-600 hover:text-primary-700 underline">priyangshumukherjee07@gmail.com</a></p>
              <p><strong>Platform:</strong> Mental Health Assessment Platform</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

