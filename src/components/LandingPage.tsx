import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Brain, Heart, Shield } from 'lucide-react';
import Navbar from './Navbar';
import StatisticsSection from './StatisticsSection';
import ResourcesSection from './ResourcesSection';
import Footer from './Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState<boolean>(() => !sessionStorage.getItem('landingIntroShown'));

  useEffect(() => {
    // Optimize ScrollTrigger globally
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true
    });

    const ctx = gsap.context(() => {
      // Hero section animations - optimized for performance
      if (heroRef.current) {
        // Set initial state
        gsap.set(heroRef.current, { opacity: 0, force3D: true });
        
        // Simple fade in - no complex animations
        gsap.to(heroRef.current, { 
          opacity: 1, 
          duration: 0.4, 
          ease: "power1.out",
          force3D: true
        });
        
        // Animate hero text elements - simplified
        const heroContent = heroRef.current.querySelectorAll('h1, p');
        gsap.set(heroContent, { opacity: 0, y: 15, force3D: true });
        gsap.to(heroContent, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power1.out",
          delay: 0.1,
          force3D: true
        });
      }

      // Scroll indicator animation - optimized
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, { 
          y: 10, 
          duration: 1.5, 
          repeat: -1, 
          yoyo: true, 
          ease: "sine.inOut",
          force3D: true
        });
      }

      // Scroll-triggered animations - optimized for performance
      // Batch all sections together for better performance
      const sections = gsap.utils.toArray('.fade-in-section') as HTMLElement[];
      
      // Set all initial states at once
      gsap.set(sections, { 
        opacity: 0, 
        y: 20,
        force3D: true
      });
      
      // Create ScrollTriggers with optimized settings
      sections.forEach((section: HTMLElement, index: number) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 98%",
          once: true,
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: index * 0.02,
              ease: "power1.out",
              force3D: true
            });
          }
        });
      });

      // Intro overlay timeline (one-time per session) - faster
      if (showIntro && introRef.current) {
        const el = introRef.current;
        const tl = gsap.timeline();
        tl.set('body', { overflow: 'hidden' })
          .to(el, { opacity: 1, duration: 0.2, ease: 'power2.out' })
          .to(el, { opacity: 1, duration: 0.8, ease: 'power1.out' })
          .to(el, { opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => {
            setShowIntro(false);
            sessionStorage.setItem('landingIntroShown', '1');
            gsap.set('body', { overflow: 'auto' });
          }});
      }
    });
    
    return () => {
      ctx.revert();
      // Clean up ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.once) {
          trigger.kill();
        }
      });
    };
  }, [showIntro]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('statistics-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Intro Overlay - plays once per session */}
      {showIntro && (
        <div ref={introRef} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white">
          <div className="text-center px-6">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">Better mental health begins with understanding.</h1>
            <p className="text-white/80 text-lg md:text-xl">A calm space to learn, reflect, and take action—at your pace.</p>
          </div>
        </div>
      )}

      {/* Hero Section with Earth Video */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-16 md:pb-20">
        {/* Earth Video Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {/* Fallback gradient background - always visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          
          {/* Video element */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full video-filter"
            style={{ zIndex: 1, objectFit: 'cover' }}
            onError={(e) => {
              console.error('Video error:', e);
              const videoElement = e.currentTarget;
              console.error('Video src:', videoElement.currentSrc);
              console.error('Video error details:', videoElement.error);
              // Don't hide, just log the error
            }}
            onLoadStart={() => {
              console.log('Video loading started');
            }}
            onLoadedMetadata={(e) => {
              console.log('Video metadata loaded');
              const videoElement = e.currentTarget;
              console.log('Video dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);
            }}
            onLoadedData={(e) => {
              console.log('Video data loaded');
              const videoElement = e.currentTarget;
              videoElement.play().catch(err => {
                console.error('Video play error:', err);
              });
            }}
            onCanPlay={() => {
              console.log('Video can play');
            }}
            onPlay={() => {
              console.log('Video is playing');
            }}
            onPause={() => {
              console.log('Video paused');
            }}
          >
            {/* Primary source - Local uploaded video */}
            <source src={`${process.env.PUBLIC_URL || ''}/videos/bg-video.mp4`} type="video/mp4" />
            {/* Fallback to Pexels video if local video fails */}
            <source src="https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_30fps.mp4" type="video/mp4" />
            {/* Your browser does not support the video tag. */}
          </video>
          
          {/* Overlay gradient for better text readability - reduced opacity to show video */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/50 to-indigo-900/60 z-[2]"></div>
          
          {/* Animated gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse-slow z-[2]"></div>
        </div>

        {/* Hero Content - Mobile First with Better Spacing */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-8 sm:py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-6 sm:mb-8 md:mb-10 text-white leading-[1.1] sm:leading-tight px-2">
            A Global Mental Health Crisis
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed font-light px-3 sm:px-4">
            Behind every statistic is a person, a family, a community. Mental health isn't a niche issue—
            <span className="inline-block"> it shapes classrooms, workplaces, and public health.</span>
          </p>

          <div className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 md:mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed px-3 sm:px-4 space-y-2 sm:space-y-3">
            <div className="flex items-start justify-center gap-2 sm:gap-3">
              <span className="text-blue-300 mt-1">•</span>
              <span>~970M people live with a mental disorder worldwide.</span>
            </div>
            <div className="flex items-start justify-center gap-2 sm:gap-3">
              <span className="text-blue-300 mt-1">•</span>
              <span>700K+ lives lost to suicide every year.</span>
            </div>
            <div className="flex items-start justify-center gap-2 sm:gap-3">
              <span className="text-blue-300 mt-1">•</span>
              <span>Up to 88% treatment gap in low‑income countries.</span>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16 px-2 max-w-5xl mx-auto">
            <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm py-5 sm:py-6 px-5 sm:px-6 text-left hover:bg-white/15 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">970M+</div>
              <div className="text-blue-200 text-xs sm:text-sm md:text-base leading-relaxed">people living with a mental disorder</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm py-5 sm:py-6 px-5 sm:px-6 text-left hover:bg-white/15 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">700K+</div>
              <div className="text-blue-200 text-xs sm:text-sm md:text-base leading-relaxed">deaths by suicide each year</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm py-5 sm:py-6 px-5 sm:px-6 text-left hover:bg-white/15 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">88%</div>
              <div className="text-blue-200 text-xs sm:text-sm md:text-base leading-relaxed">treatment gap in low‑income countries</div>
            </div>
          </div>

          {/* Why it matters (Atomic-style minimalist icon row) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-8 md:gap-10 lg:gap-12 mb-10 sm:mb-12 md:mb-16 px-4">
            <div className="flex flex-col items-center group w-full sm:w-auto flex-shrink-0">
              <div className="p-4 sm:p-5 md:p-6 rounded-full bg-blue-500/20 group-hover:bg-blue-500/40 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 ease-out backdrop-blur-sm border border-blue-400/30 shadow-lg shadow-blue-500/20 mb-3 sm:mb-4">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-blue-200 group-hover:text-blue-100 group-hover:translate-y-[-2px] tracking-wide text-center max-w-[150px] transition-all duration-300">Early Awareness Saves Lives</span>
            </div>
            <div className="flex flex-col items-center group w-full sm:w-auto flex-shrink-0">
              <div className="p-4 sm:p-5 md:p-6 rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 ease-out backdrop-blur-sm border border-purple-400/30 shadow-lg shadow-purple-500/20 mb-3 sm:mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-purple-200 group-hover:text-purple-100 group-hover:translate-y-[-2px] tracking-wide text-center max-w-[150px] transition-all duration-300">Support Reduces Harm</span>
            </div>
            <div className="flex flex-col items-center group w-full sm:w-auto flex-shrink-0">
              <div className="p-4 sm:p-5 md:p-6 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 ease-out backdrop-blur-sm border border-indigo-400/30 shadow-lg shadow-indigo-500/20 mb-3 sm:mb-4">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-indigo-200 group-hover:text-indigo-100 group-hover:translate-y-[-2px] tracking-wide text-center max-w-[150px] transition-all duration-300">Dignity & Privacy Matter</span>
            </div>
          </div>

          {/* Primary CTA now encourages learning first; assessment secondary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 px-4">
            <a
              href="#statistics-section"
              className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 hover:bg-white/25 hover:scale-105 hover:-translate-y-1 text-white px-8 py-3.5 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300 ease-out backdrop-blur-sm shadow-lg hover:shadow-2xl"
            >
              Explore the Facts
            </a>
            <button 
              onClick={() => window.location.href = '/survey'}
              className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:-translate-y-1 text-white font-semibold py-3.5 sm:py-4 px-8 rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg shadow-lg hover:shadow-2xl"
            >
              Take Assessment
            </button>
          </div>
        </div>

        {/* Scroll Indicator - Mobile Responsive */}
        <div 
          ref={scrollIndicatorRef}
          onClick={scrollToNext}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group z-10"
        >
          <div className="flex flex-col items-center text-white/70 group-hover:text-white transition-colors duration-300 px-4 py-2">
            <span className="text-[10px] sm:text-xs mb-1 sm:mb-2 font-medium">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics-section" className="fade-in-section py-8 sm:py-12 md:py-16">
        <StatisticsSection />
      </section>

      {/* Resources Section */}
      <section id="resources" className="fade-in-section py-8 sm:py-12 md:py-16">
        <ResourcesSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
