import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Brain, Heart, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

gsap.registerPlugin(ScrollTrigger);

interface StatData {
  id: number;
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

// Statistics based on WHO World Mental Health Report 2022, WHO Global Health Estimates 2024
// Sources: WHO, NIMH, Lancet Psychiatry 2024
const statisticsData: StatData[] = [
  {
    id: 1,
    title: "Global Mental Health Impact",
    value: "970M+",
    description: "people worldwide live with a mental disorder (WHO 2024). Approximately 1 in 8 people globally are affected",
    icon: <Users className="w-12 h-12" />,
    color: "from-blue-500 to-cyan-500",
    trend: "Source: WHO Global Health Estimates 2024"
  },
  {
    id: 2,
    title: "Depression Prevalence",
    value: "280M",
    description: "people globally suffer from depression (WHO 2024). Depression is the leading cause of disability worldwide, affecting more than 3.8% of the population",
    icon: <Brain className="w-12 h-12" />,
    color: "from-purple-500 to-pink-500",
    trend: "WHO Global Health Estimates 2024"
  },
  {
    id: 3,
    title: "Anxiety Disorders",
    value: "301M",
    description: "people affected by anxiety disorders globally (WHO 2024). Women are approximately 2.3 times more likely than men to experience anxiety disorders",
    icon: <Heart className="w-12 h-12" />,
    color: "from-green-500 to-emerald-500",
    trend: "WHO Mental Health Atlas 2024"
  },
  {
    id: 4,
    title: "Treatment Gap",
    value: "88%",
    description: "treatment gap in low-income countries (WHO Mental Health Atlas 2020). Only 12% of people with mental disorders receive treatment in low-income countries, compared to 70% in high-income countries",
    icon: <TrendingUp className="w-12 h-12" />,
    color: "from-orange-500 to-red-500",
    trend: "WHO Mental Health Atlas 2020"
  },
  {
    id: 5,
    title: "Youth Mental Health",
    value: "50%",
    description: "of all mental health conditions start by age 14, and 75% develop by age 24 (WHO 2024). Suicide is the fourth leading cause of death among 15-29 year-olds globally",
    icon: <Users className="w-12 h-12" />,
    color: "from-indigo-500 to-blue-500",
    trend: "WHO World Mental Health Report 2022"
  },
  {
    id: 6,
    title: "Suicide Statistics",
    value: "700K+",
    description: "deaths by suicide annually worldwide (WHO 2024). One in every 100 deaths is by suicide, making it a critical global public health priority",
    icon: <TrendingUp className="w-12 h-12" />,
    color: "from-red-500 to-pink-500",
    trend: "WHO Suicide Prevention Report 2024"
  }
];

// Chart data for visualizations - Based on WHO 2024 Mental Health Report
// Source: WHO Global Health Estimates 2024, World Mental Health Report 2022
const mentalHealthChartData = [
  { condition: 'Depression', prevalence: 280, color: '#8B5CF6', source: 'WHO 2024' },
  { condition: 'Anxiety', prevalence: 301, color: '#10B981', source: 'WHO 2024' },
  { condition: 'Bipolar', prevalence: 45, color: '#F59E0B', source: 'WHO 2024' },
  { condition: 'Schizophrenia', prevalence: 24, color: '#EF4444', source: 'WHO 2024' },
  { condition: 'PTSD', prevalence: 12, color: '#06B6D4', source: 'WHO 2024' }
];

// Source: WHO Mental Health Atlas 2020, NIMH 2024
const ageGroupData = [
  { age: '0-14', percentage: 5, color: '#3B82F6', source: 'WHO' },
  { age: '15-24', percentage: 50, color: '#8B5CF6', source: 'WHO' },
  { age: '25-44', percentage: 30, color: '#10B981', source: 'WHO' },
  { age: '45-64', percentage: 12, color: '#F59E0B', source: 'WHO' },
  { age: '65+', percentage: 3, color: '#EF4444', source: 'WHO' }
];

// Source: WHO Mental Health Atlas 2020 - Treatment Gap by Income Level
const treatmentGapData = [
  { region: 'High Income', treated: 70, untreated: 30 },
  { region: 'Middle Income', treated: 35, untreated: 65 },
  { region: 'Low Income', treated: 12, untreated: 88 }
];

// Use static images from public/images/insights (copied from local Images folder)
// Fallback to interactive charts if an image is missing
const whoVisuals = {
  conditionsBar: '/images/insights/Mental Health Disorders Ranked.png',
  onsetPie: '/images/insights/Mental Health Disorder distribution among Age and Gender.png',
  treatmentGapStacked: '/images/insights/burden-disease-from-each-mental-illness.png',
};

const StatCard: React.FC<{ stat: StatData; index: number }> = ({ stat, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [index]);

  return (
    <div ref={cardRef} className="h-full">
      <div className="stat-card card h-full bg-stone-50/95 backdrop-blur-sm border border-stone-200/60 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] hover:border-primary-300/60 hover:-translate-y-3 hover:scale-[1.03] transition-all duration-300 ease-out group">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 group-hover:scale-130 group-hover:rotate-6 group-hover:shadow-lg transition-all duration-300 ease-out`}>
          {stat.icon}
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 ease-out">
          {stat.title}
        </h3>
        
        <div className="text-4xl font-bold text-gradient mb-4">
          {stat.value}
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-4">
          {stat.description}
        </p>
        
        {stat.trend && (
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
            {stat.trend}
          </div>
        )}
      </div>
    </div>
  );
};

const StatisticsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation removed - text appears immediately

      // Card animations - faster and synchronized
      const cards = gsap.utils.toArray<HTMLElement>('.stat-card');
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { 
            opacity: 0, 
            y: 30, 
            scale: 0.96,
            filter: 'blur(4px)'
          },
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

      // Chart/Image animations - faster and triggers earlier
      const charts = gsap.utils.toArray<HTMLElement>('.chart-container');
      charts.forEach((chart, index) => {
        gsap.fromTo(chart,
          { opacity: 0, scale: 0.96, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chart,
              start: "top 95%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16 lg:py-20 gradient-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header - Mobile First */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2">
          <h2 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-4 sm:mb-6 leading-tight">
            Understanding Mental Health
            <span className="block text-gradient">By the Numbers</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Mental health affects us all. These statistics highlight the global impact and 
            importance of mental health awareness and support.
          </p>
        </div>

        {/* Integrated Statistics with Visualizations - Mobile First */}
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {/* Global Impact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">970M+</h3>
                  <p className="text-lg text-gray-600">people with mental disorders</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                According to WHO Global Health Estimates, approximately 970 million people worldwide 
                live with a mental disorder, representing roughly 1 in 8 people globally. The adjacent chart 
                shows how different mental health conditions rank in terms of disability burden, measured by 
                Years Lived with Disability (YLDs). This ranking highlights which disorders have the greatest 
                impact on people's daily lives and ability to function, with depression and anxiety typically 
                ranking highest in terms of disability burden.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-medium">Source: WHO Global Health Estimates / Global Burden of Disease Study</p>
                <p className="text-blue-600 text-sm">Verified data from WHO showing mental health disorders ranked by their contribution to global disability burden (YLDs - Years Lived with Disability)</p>
              </div>
            </div>
            <div className="chart-container card bg-stone-50 shadow-xl border border-stone-200/60 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl hover:border-primary-300/60 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out group">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center flex-wrap gap-2 group-hover:text-primary-600 transition-colors duration-300">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                <span>Mental Health Disorders Ranked by Burden</span>
              </h4>
              {whoVisuals.conditionsBar ? (
                <figure className="rounded-xl overflow-hidden border border-stone-200/60 bg-stone-100/50 group-hover:border-primary-200/60 group-hover:bg-stone-50 transition-all duration-300">
                  <img src={whoVisuals.conditionsBar} alt="Mental health disorders ranked by Years Lived with Disability (YLDs)" className="w-full h-auto object-contain" />
                  <figcaption className="text-xs text-gray-500 p-2 flex items-center justify-between gap-2">
                    <span>Source: <a href="https://www.who.int/publications/i/item/9789240049338" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1">
                      WHO World Mental Health Report 2022
                      <ExternalLink className="w-3 h-3" />
                    </a> - Shows ranking of mental health disorders by disability burden (YLDs)</span>
                  </figcaption>
                </figure>
              ) : (
                <div className="h-64 sm:h-72 md:h-80 w-full min-h-[256px] sm:min-h-[288px] md:min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mentalHealthChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="condition" stroke="#64748b" fontSize={12} tick={{ fill: '#475569' }} />
                      <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#475569' }} />
                      <Tooltip formatter={(value: any) => [`${value}M`, 'Prevalence']} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }} />
                      <Bar dataKey="prevalence" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Depression & Anxiety Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div className="chart-container card bg-stone-50 shadow-xl border border-stone-200/60 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl hover:border-primary-300/60 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out group">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center flex-wrap gap-2 group-hover:text-primary-600 transition-colors duration-300">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                <span>Mental Health Distribution by Age and Gender</span>
              </h4>
              {whoVisuals.onsetPie ? (
                <figure className="rounded-xl overflow-hidden border border-stone-200/60 bg-stone-100/50 group-hover:border-primary-200/60 group-hover:bg-stone-50 transition-all duration-300">
                  <img src={whoVisuals.onsetPie} alt="Mental health disorder distribution across different age groups and gender" className="w-full h-auto object-contain" />
                  <figcaption className="text-xs text-gray-500 p-2 flex items-center justify-between gap-2">
                    <span>Source: <a href="https://www.who.int/publications/i/item/9789240049338" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1">
                      WHO World Mental Health Report 2022
                      <ExternalLink className="w-3 h-3" />
                    </a> - Shows how mental health disorders are distributed across age groups and gender</span>
                  </figcaption>
                </figure>
              ) : (
                <div className="h-64 sm:h-72 md:h-80 w-full min-h-[256px] sm:min-h-[288px] md:min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ageGroupData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="percentage">
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#475569' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">280M+</div>
                  <p className="text-purple-800 font-medium">Depression Cases</p>
                  <p className="text-purple-600 text-sm">Leading cause of disability</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">301M+</div>
                  <p className="text-green-800 font-medium">Anxiety Cases</p>
                  <p className="text-green-600 text-sm">Women 2x more affected</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                The chart visualizes how mental health disorders are distributed across different age groups and gender. 
                According to WHO data, depression affects approximately 280 million people globally, while anxiety 
                disorders affect around 301 million. The visualization reveals critical patterns: mental health 
                conditions often begin early in life (50% by age 14, 75% by age 24), and there are significant 
                gender differences in prevalence rates. Women are approximately 2.3 times more likely than men 
                to experience anxiety disorders, while depression affects both genders but with varying patterns 
                across age groups.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-yellow-800 font-medium">Source: WHO World Mental Health Report 2022 / Global Health Estimates</p>
                <p className="text-yellow-600 text-sm">Verified WHO data showing mental health disorder distribution patterns across age groups and gender, revealing important demographic and epidemiological trends</p>
              </div>
            </div>
          </div>

          {/* Disease Burden Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Disease Burden</h3>
                  <p className="text-lg text-gray-600">by mental illness type</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                The chart illustrates the disease burden (disability-adjusted life years - DALYs) contributed 
                by different types of mental illnesses. According to WHO Global Burden of Disease Study, mental 
                health conditions account for a significant portion of global disability. This visualization shows 
                which mental health conditions have the greatest impact on global health, measured by years of 
                healthy life lost. Understanding this burden helps prioritize resources and interventions for 
                the most impactful conditions.
              </p>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-red-800 font-medium">Source: WHO Global Burden of Disease Study / Our World in Data</p>
                <p className="text-red-600 text-sm">The chart shows relative disease burden (DALYs) from different mental illness types, helping identify which conditions have the greatest health impact globally</p>
              </div>
            </div>
            <div className="chart-container card bg-stone-50 shadow-xl border border-stone-200/60 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl hover:border-primary-300/60 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out group">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center flex-wrap gap-2 group-hover:text-primary-600 transition-colors duration-300">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                <span>Disease Burden by Mental Illness Type</span>
              </h4>
              {whoVisuals.treatmentGapStacked ? (
                <figure className="rounded-xl overflow-hidden border border-stone-200/60 bg-stone-100/50 group-hover:border-primary-200/60 group-hover:bg-stone-50 transition-all duration-300">
                  <img src={whoVisuals.treatmentGapStacked} alt="Burden of disease from each mental illness type showing relative impact" className="w-full h-auto object-contain" />
                  <figcaption className="text-xs text-gray-500 p-2 flex items-center justify-between gap-2">
                    <span>Source: <a href="https://ourworldindata.org/mental-health" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1">
                      Our World in Data — Mental Health
                      <ExternalLink className="w-3 h-3" />
                    </a> - Shows the relative disease burden contributed by different types of mental illnesses</span>
                  </figcaption>
                </figure>
              ) : (
                <div className="h-64 sm:h-72 md:h-80 w-full min-h-[256px] sm:min-h-[288px] md:min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={treatmentGapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="region" stroke="#64748b" fontSize={12} tick={{ fill: '#475569' }} />
                      <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#475569' }} />
                      <Tooltip formatter={(value: any, name: string) => [`${value}%`, name === 'treated' ? 'Treated' : 'Untreated']} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#475569', paddingTop: '20px' }} />
                      <Bar dataKey="treated" stackId="a" fill="#10b981" name="Treated" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="untreated" stackId="a" fill="#ef4444" name="Untreated" radius={[0, 0, 8, 8]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Economic Impact Section */}
          <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-5xl font-bold text-gray-900">$2.5T+</h3>
                  <p className="text-xl text-gray-600">Annual global economic cost</p>
                </div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                According to WHO and World Economic Forum estimates, mental health conditions cost the global 
                economy over $2.5 trillion annually through lost productivity and healthcare costs. By 2030, 
                this is projected to reach $6 trillion, making mental health support both a moral imperative 
                and an economic necessity. The treatment gap varies dramatically by country income level, as 
                shown in the statistics below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="text-2xl font-bold text-blue-600 mb-2">70%</div>
                  <p className="text-slate-700 font-medium">High-income countries</p>
                  <p className="text-slate-600 text-sm">Treatment coverage rate - WHO Mental Health Atlas 2020</p>
                </div>
                <div className="bg-stone-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">35%</div>
                  <p className="text-slate-700 font-medium">Middle-income countries</p>
                  <p className="text-slate-600 text-sm">Treatment coverage rate - WHO Mental Health Atlas 2020</p>
                </div>
                <div className="bg-stone-50 p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <div className="text-2xl font-bold text-red-600 mb-2">12%</div>
                  <p className="text-slate-700 font-medium">Low-income countries</p>
                  <p className="text-slate-600 text-sm">Treatment coverage rate - WHO Mental Health Atlas 2020</p>
                  <p className="text-red-600 text-xs mt-1 font-semibold">88% treatment gap</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block p-8 bg-stone-50/90 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/60">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Take Control of Your Mental Health?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Our AI-powered assessment can help you understand your mental health status 
              and provide personalized recommendations.
            </p>
            <button 
              onClick={() => window.location.href = '/survey'}
              className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl"
            >
              Start Your Assessment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
