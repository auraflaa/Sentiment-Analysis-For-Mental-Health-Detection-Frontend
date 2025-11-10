import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  
  // Pages that need white navbar background (light backgrounds)
  const needsWhiteNavbar = ['/research', '/resources', '/survey', '/results', '/past-assessments'].includes(location.pathname);
  const shouldShowWhiteBg = isScrolled || needsWhiteNavbar;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      shouldShowWhiteBg ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 ease-out">
              <Brain className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className={`font-bold text-lg md:text-xl transition-colors duration-300 ${
                shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
              }`}>
                Mental Health
              </div>
              <div className={`text-xs md:text-sm transition-colors duration-300 ${
                shouldShowWhiteBg ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Assessment Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-all duration-300 ease-out hover:translate-y-[-2px] ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : shouldShowWhiteBg 
                    ? 'text-slate-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-200'
              }`}
            >
              Home
            </Link>
            <Link
              to="/survey"
              className={`font-medium transition-all duration-300 ease-out hover:translate-y-[-2px] ${
                isActive('/survey') 
                  ? 'text-blue-600' 
                  : shouldShowWhiteBg 
                    ? 'text-slate-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-200'
              }`}
            >
              Assessment
            </Link>
            <a
              href="#statistics-section"
              className={`font-medium transition-all duration-300 ease-out hover:translate-y-[-2px] ${
                shouldShowWhiteBg 
                  ? 'text-slate-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Statistics
            </a>
            <a
              href="#resources"
              className={`font-medium transition-all duration-300 ease-out hover:translate-y-[-2px] ${
                shouldShowWhiteBg 
                  ? 'text-slate-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Resources
            </a>
            <Link
              to="/research"
              className={`font-medium transition-all duration-300 ease-out hover:translate-y-[-2px] ${
                isActive('/research') 
                  ? 'text-blue-600' 
                  : shouldShowWhiteBg 
                    ? 'text-slate-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-200'
              }`}
            >
              Research
            </Link>
            <Link
              to="/past-assessments"
              className={`font-medium transition-all duration-300 ease-out hover:translate-y-[-2px] ${
                isActive('/past-assessments') 
                  ? 'text-blue-600' 
                  : shouldShowWhiteBg 
                    ? 'text-slate-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-200'
              }`}
            >
              Past Results
            </Link>
            <Link
              to="/survey"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:-translate-y-1 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-2xl"
            >
              Begin Assessment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              shouldShowWhiteBg ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 bg-white/95 backdrop-blur-md rounded-b-lg shadow-lg">
            <div className="flex flex-col space-y-3 px-4 pt-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`font-medium py-2 px-4 rounded-lg transition-colors duration-300 ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/survey"
                onClick={() => setIsOpen(false)}
                className={`font-medium py-2 px-4 rounded-lg transition-colors duration-300 ${
                  isActive('/survey') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Assessment
              </Link>
              <a
                href="#statistics-section"
                onClick={() => setIsOpen(false)}
                className="font-medium py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Statistics
              </a>
              <a
                href="#resources"
                onClick={() => setIsOpen(false)}
                className="font-medium py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Resources
              </a>
              <Link
                to="/research"
                onClick={() => setIsOpen(false)}
                className={`font-medium py-2 px-4 rounded-lg transition-colors duration-300 ${
                  isActive('/research') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Research
              </Link>
              <Link
                to="/past-assessments"
                onClick={() => setIsOpen(false)}
                className={`font-medium py-2 px-4 rounded-lg transition-colors duration-300 ${
                  isActive('/past-assessments') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Past Results
              </Link>
              <Link
                to="/survey"
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300 transform active:scale-95 shadow-lg"
              >
                Begin Assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

