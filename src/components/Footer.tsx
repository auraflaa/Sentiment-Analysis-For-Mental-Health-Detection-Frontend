import React from 'react';
import { 
  Brain, 
  Shield, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-125 hover:-translate-y-1 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 mx-auto" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Mental Health</h3>
                  <p className="text-gray-400 text-sm">Assessment Platform</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Empowering individuals to understand and take control of their mental 
                wellbeing through AI-powered assessments and personalized insights.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 hover:scale-125 hover:-translate-y-1 transition-all duration-300 ease-out" title="Follow us on Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 hover:scale-125 hover:-translate-y-1 transition-all duration-300 ease-out" title="Follow us on Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 hover:scale-125 hover:-translate-y-1 transition-all duration-300 ease-out" title="Follow us on Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 hover:scale-125 hover:-translate-y-1 transition-all duration-300 ease-out" title="Follow us on LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 ease-out inline-block">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/survey" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 ease-out inline-block">
                    Take Assessment
                  </a>
                </li>
                <li>
                  <a href="#resources" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 ease-out inline-block">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="#statistics" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 ease-out inline-block">
                    Statistics
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.thelivelovelaughfoundation.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 ease-out inline-block">
                    The Live Love Laugh Foundation
                  </a>
                </li>
                <li>
                  <a href="https://www.nimhans.ac.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                    NIMHANS
                  </a>
                </li>
                <li>
                  <a href="https://www.yourdost.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                    YourDOST
                  </a>
                </li>
                <li>
                  <a href="https://www.wysa.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Wysa
                  </a>
                </li>
                <li>
                  <a href="https://www.amahahealth.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Amaha (formerly InnerHour)
                  </a>
                </li>
                <li>
                  <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Find A Helpline (global directory)
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <a href="mailto:priyangshumukherjee07@gmail.com" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 ease-out inline-block" title="Contact us">
                    priyangshumukherjee07@gmail.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        'Call Vandrevala Foundation Helpline?\n\nPhone: 1860-2662-345\n\nThis will open your phone dialer. Click OK to continue.'
                      );
                      if (confirmed) {
                        window.location.href = 'tel:18602662345';
                      }
                    }}
                    className="text-gray-400 hover:text-white hover:translate-x-1 hover:scale-110 transition-all duration-300 ease-out inline-block text-left"
                    title="Call Vandrevala Foundation Helpline (India)"
                  >
                    1860-2662-345 (India)
                  </button>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300" title="Find local helplines">
                    Global Support Directory
                  </a>
                </li>
              </ul>
              
              {/* Crisis Hotlines */}
              <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                <h5 className="font-semibold text-red-300 mb-2">Crisis Support</h5>
                <p className="text-sm text-red-200 mb-2">If you're in crisis, please call:</p>
                <p className="text-lg font-bold text-red-300">1860-2662-345</p>
                <p className="text-xs text-red-200">Vandrevala Foundation Helpline (24/7)</p>
                <p className="text-xs text-red-200 mt-1">Or: 1800-2333-330</p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © {currentYear} Mental Health Assessment Platform. All rights reserved. Made by <span className="font-semibold text-white">Priyangshu Mukherjee</span>.
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="/disclaimer" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Disclaimer
                </a>
              </div>
            </div>

            {/* Author & Model Links */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
              <div className="text-gray-400">
                Author:
                <a
                  href="https://www.linkedin.com/in/priyangshu-mukherjee/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-300 hover:text-white hover:translate-x-1 underline underline-offset-2 transition-all duration-300 ease-out inline-block"
                >
                  Priyangshu Mukherjee (LinkedIn)
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href="https://huggingface.co/ourafla/mental-health-bert-finetuned"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white hover:translate-x-1 underline underline-offset-2 transition-all duration-300 ease-out inline-block"
                  title="Hugging Face Model Card"
                >
                  Model: Mental Health BERT (fine-tuned)
                </a>
                <span className="hidden sm:inline text-gray-600">•</span>
                <a
                  href="https://huggingface.co/spaces/ourafla/Mental-Health-Detection-Model-Interface"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white hover:translate-x-1 underline underline-offset-2 transition-all duration-300 ease-out inline-block"
                  title="Hugging Face Space Interface"
                >
                  Live Space: Model Interface
                </a>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-yellow-300 mb-1">Medical Disclaimer</h5>
                  <p className="text-xs text-yellow-200 leading-relaxed">
                    This platform is for educational and awareness purposes only. It is not a substitute for 
                    professional medical advice, diagnosis, or treatment. Always seek the advice of qualified 
                    health providers with questions about medical conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
