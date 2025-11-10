import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TermsOfService: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll('.terms-section');
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
          <div className="text-center mb-12 terms-section">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="card bg-white mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using the Mental Health Assessment Platform, you agree to be bound by these 
              Terms of Service and all applicable laws and regulations. If you do not agree with any of these 
              terms, you are prohibited from using this platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These terms constitute a legal agreement between you and the Mental Health Assessment Platform. 
              Please read them carefully before using our services.
            </p>
          </div>

          {/* Acceptance */}
          <div className="card bg-white mb-8 terms-section">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-800">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              By using this platform, you acknowledge that you have read, understood, and agree to be bound 
              by these Terms of Service. You also agree to comply with all applicable local, state, national, 
              and international laws and regulations.
            </p>
          </div>

          {/* Use of Service */}
          <div className="card bg-white mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Use of Service</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Permitted Use</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may use our platform for:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
                  <li>Personal mental health self-assessment and awareness</li>
                  <li>Educational purposes related to mental health</li>
                  <li>Accessing mental health resources and information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Prohibited Use</h3>
                <p className="text-gray-700 leading-relaxed">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to any part of the platform</li>
                  <li>Interfere with or disrupt the platform's operation or security</li>
                  <li>Use automated systems to access the platform without permission</li>
                  <li>Reproduce, duplicate, or copy any content without authorization</li>
                  <li>Use the platform to harm, threaten, or harass others</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="card bg-yellow-50 border-yellow-200 mb-8 terms-section">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-slate-800">Medical Disclaimer</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed font-semibold">
                IMPORTANT: This platform is for educational and awareness purposes only.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>This platform is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment</li>
                <li>The assessments provided are <strong>NOT</strong> medical diagnoses</li>
                <li>Always seek the advice of qualified health providers with any questions about medical conditions</li>
                <li>Never disregard professional medical advice or delay seeking it because of information from this platform</li>
                <li>If you are experiencing a mental health crisis, contact emergency services or a crisis hotline immediately</li>
              </ul>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="card bg-white mb-8 terms-section">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">Limitation of Liability</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>The platform is provided "as is" without warranties of any kind</li>
                <li>We do not guarantee the accuracy, completeness, or usefulness of any information provided</li>
                <li>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform</li>
                <li>We are not responsible for any decisions made based on information from this platform</li>
                <li>You assume full responsibility for your use of the platform and any consequences thereof</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="card bg-white mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All content, features, and functionality of the platform are owned by the Mental Health 
                Assessment Platform and are protected by copyright, trademark, and other intellectual 
                property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works from any content 
                without express written permission.
              </p>
            </div>
          </div>

          {/* User Content */}
          <div className="card bg-white mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">User Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Any content you provide through the platform (including assessment responses) is stored locally 
              in your browser. We do not claim ownership of your content. However, by using the platform, 
              you grant us a license to use anonymized, aggregated data for improving our services.
            </p>
          </div>

          {/* Termination */}
          <div className="card bg-white mb-8 terms-section">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-800">Termination</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend your access to the platform at any time, without 
              notice, for any reason, including if you violate these Terms of Service. You may also stop 
              using the platform at any time by clearing your browser's local storage.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="card bg-white mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify you of any 
              significant changes by posting the updated terms on this page and updating the "Last updated" 
              date. Your continued use of the platform after changes are posted constitutes acceptance of 
              the modified terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="card bg-white mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law provisions. Any disputes arising from these terms or your 
              use of the platform shall be resolved through appropriate legal channels.
            </p>
          </div>

          {/* Contact */}
          <div className="card bg-blue-50 border-blue-200 mb-8 terms-section">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
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

export default TermsOfService;

