import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Brain, 
  Heart, 
  Search,
  ExternalLink,
  Calendar,
  Lightbulb,
  Target,
  Award
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Article {
  id: number;
  title: string;
  author: string;
  journal: string;
  year: number;
  description: string;
  url: string;
  category: 'research' | 'journal' | 'article';
  tags: string[];
  coverImage?: string;
}

interface GrowthResource {
  id: number;
  title: string;
  type: 'article' | 'guide' | 'exercise' | 'worksheet';
  description: string;
  content: string;
  category: string;
  icon: React.ReactNode;
  url?: string;
  image?: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "World Mental Health Report 2022: Transforming mental health for all",
    author: "World Health Organization",
    journal: "WHO Publications",
    year: 2022,
    description: "Comprehensive analysis of global mental health burden, treatment gaps, and policy recommendations from WHO.",
    url: "https://www.who.int/publications/i/item/9789240049338",
    category: 'research',
    tags: ['Global Health', 'Epidemiology', 'Policy'],
    coverImage: "https://www.who.int/images/default-source/wpro/countries/philippines/feature-stories/who-mental-health-report-2022.jpg"
  },
  {
    id: 2,
    title: "Early Intervention in Mental Health: Evidence-Based Approaches",
    author: "McGorry PD, Mei C",
    journal: "World Psychiatry",
    year: 2023,
    description: "Review of evidence-based early intervention strategies for mental health conditions in youth and young adults.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10270418/",
    category: 'research',
    tags: ['Early Intervention', 'Youth Mental Health', 'Evidence-Based'],
    coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400"
  },
  {
    id: 3,
    title: "Digital Mental Health Interventions: Efficacy and Accessibility",
    author: "Torous J, et al.",
    journal: "JMIR",
    year: 2023,
    description: "Systematic review of digital mental health interventions and their effectiveness across diverse populations.",
    url: "https://jmir.org/article/12869",
    category: 'journal',
    tags: ['Digital Health', 'Technology', 'Accessibility'],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
  },
  {
    id: 4,
    title: "Gender Differences in Mental Health: A Global Perspective",
    author: "Riecher-Rössler A",
    journal: "World Psychiatry",
    year: 2017,
    description: "Analysis of gender disparities in mental health prevalence, treatment access, and outcomes worldwide.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7892592/",
    category: 'research',
    tags: ['Gender', 'Global Health', 'Health Equity'],
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400"
  },
  {
    id: 5,
    title: "Suicide Prevention Strategies: Evidence from Low-Resource Settings",
    author: "WHO",
    journal: "The Lancet Global Health",
    year: 2022,
    description: "Evidence-based suicide prevention strategies adapted for low-resource settings and their effectiveness.",
    url: "https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(24)00197-X/fulltext",
    category: 'research',
    tags: ['Suicide Prevention', 'Global Health', 'Public Health'],
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400"
  },
  {
    id: 6,
    title: "Mental Health Stigma: Barriers to Treatment and Recovery",
    author: "Corrigan PW, et al.",
    journal: "Social Science & Medicine",
    year: 2014,
    description: "Comprehensive review of mental health stigma, its impact on treatment-seeking, and anti-stigma interventions.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1489832/",
    category: 'article',
    tags: ['Stigma', 'Social Psychology', 'Treatment Barriers'],
    coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"
  },
  {
    id: 7,
    title: "Cognitive Behavioral Therapy: Mechanisms and Outcomes",
    author: "Hofmann SG, et al.",
    journal: "Clinical Psychology Review",
    year: 2012,
    description: "Meta-analysis of CBT mechanisms, effectiveness across conditions, and factors influencing outcomes.",
    url: "https://pubmed.ncbi.nlm.nih.gov/16199119/",
    category: 'research',
    tags: ['CBT', 'Psychotherapy', 'Treatment Outcomes'],
    coverImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
  },
  {
    id: 8,
    title: "Mental Health in the Workplace: Prevention and Support Programs",
    author: "Joyce S, et al.",
    journal: "Journal of Occupational Health Psychology",
    year: 2016,
    description: "Evaluation of workplace mental health programs, their effectiveness, and implementation strategies.",
    url: "https://www.apa.org/pubs/journals/ocp",
    category: 'article',
    tags: ['Workplace', 'Prevention', 'Organizational Psychology'],
    coverImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400"
  }
];

const growthResources: GrowthResource[] = [
  {
    id: 1,
    title: "Mindfulness Meditation Guide",
    type: 'guide',
    description: "Step-by-step guide to starting a mindfulness meditation practice for mental wellness.",
    content: "Mindfulness meditation is a powerful tool for managing stress, anxiety, and improving overall mental well-being. This guide covers basic techniques, breathing exercises, and how to establish a regular practice.",
    category: 'Self-Care',
    icon: <Brain className="w-6 h-6" />,
    url: "https://www.mindful.org/how-to-meditate/",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  },
  {
    id: 2,
    title: "Cognitive Restructuring Worksheet",
    type: 'worksheet',
    description: "Practical worksheet to identify and challenge negative thought patterns.",
    content: "Use this worksheet to identify automatic negative thoughts, examine evidence for and against them, and develop more balanced perspectives. Based on Cognitive Behavioral Therapy principles.",
    category: 'Therapy Tools',
    icon: <FileText className="w-6 h-6" />,
    url: "https://www.psychologytools.com/resource/thought-record-universal/",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400"
  },
  {
    id: 3,
    title: "Building Resilience: A Practical Guide",
    type: 'article',
    description: "Evidence-based strategies for building emotional resilience and coping skills.",
    content: "Resilience is the ability to bounce back from adversity. This guide explores research-backed strategies including social support, problem-solving skills, and maintaining a positive outlook.",
    category: 'Personal Growth',
    icon: <Target className="w-6 h-6" />,
    url: "https://www.apa.org/topics/resilience",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
  },
  {
    id: 4,
    title: "Sleep Hygiene Practices",
    type: 'guide',
    description: "Comprehensive guide to improving sleep quality for better mental health.",
    content: "Quality sleep is essential for mental health. This guide covers sleep hygiene practices, creating a bedtime routine, and addressing common sleep problems that affect mental well-being.",
    category: 'Self-Care',
    icon: <Heart className="w-6 h-6" />,
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400"
  },
  {
    id: 5,
    title: "Emotional Regulation Exercises",
    type: 'exercise',
    description: "Practical exercises to help manage and regulate difficult emotions.",
    content: "Learn evidence-based techniques for emotional regulation including deep breathing, progressive muscle relaxation, and grounding techniques. These exercises can help manage anxiety, anger, and stress.",
    category: 'Therapy Tools',
    icon: <Award className="w-6 h-6" />,
    url: "https://www.verywellmind.com/self-compassion-exercises-to-practice-daily-8619690",
    image: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400"
  },
  {
    id: 6,
    title: "Goal Setting for Mental Wellness",
    type: 'article',
    description: "How to set and achieve meaningful goals that support your mental health journey.",
    content: "Setting realistic, meaningful goals is crucial for mental wellness. This article covers SMART goal setting, breaking down large goals, and maintaining motivation throughout your journey.",
    category: 'Personal Growth',
    icon: <Lightbulb className="w-6 h-6" />,
    url: "https://www.rwapsych.com.au/blog/goal-setting-mental-wellbeing/",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400"
  },
  {
    id: 7,
    title: "CBT Worksheets Workbook",
    type: 'worksheet',
    description: "Free online CBT workbook with comprehensive worksheets and exercises.",
    content: "Access a complete collection of Cognitive Behavioral Therapy worksheets and exercises. This workbook includes thought records, behavioral activation, and other evidence-based CBT tools to support your mental health journey.",
    category: 'Therapy Tools',
    icon: <FileText className="w-6 h-6" />,
    url: "https://cogbtherapy.com/free-online-cbt-workbook",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400"
  }
];

const ResearchPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrowthCategory, setSelectedGrowthCategory] = useState<string>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const categories = ['all', 'research', 'journal', 'article'];
  const growthCategories = ['all', 'Self-Care', 'Therapy Tools', 'Personal Growth'];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredGrowthResources = growthResources.filter(resource => {
    const matchesCategory = selectedGrowthCategory === 'all' || resource.category === selectedGrowthCategory;
    return matchesCategory;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
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

      // Article cards - faster and synchronized animations
      const articleCards = gsap.utils.toArray<HTMLElement>('.article-card');
      articleCards.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30, scale: 0.96, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Growth resource cards - faster and synchronized
      const growthCards = gsap.utils.toArray<HTMLElement>('.growth-card');
      growthCards.forEach((card, index) => {
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
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="h-16 md:h-20" aria-hidden="true" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={titleRef} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Research & Growth
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Explore the latest research, evidence-based articles, and resources for mental health growth and wellness.
            </p>
          </div>
        </div>
      </section>

      <section ref={sectionRef} className="py-12 md:py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Research & Articles Section */}
          <div className="mb-24 md:mb-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Research & Articles
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Stay informed with the latest peer-reviewed research, journal articles, and evidence-based findings in mental health.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles, journals, research..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-out ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white scale-105'
                          : 'bg-stone-100 text-slate-700 hover:bg-stone-200 hover:scale-105 hover:-translate-y-0.5'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="article-card card bg-stone-50 shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] hover:border-primary-300/60 hover:scale-[1.03] hover:-translate-y-3 transition-all duration-300 ease-out border border-stone-200/60 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (article.url) {
                      window.open(article.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && article.url) {
                      e.preventDefault();
                      window.open(article.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  {article.coverImage && (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                      <img 
                        src={article.coverImage} 
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        article.category === 'research' ? 'bg-blue-100 text-blue-800' :
                        article.category === 'journal' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{article.year}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <div className="text-sm text-slate-500 mb-4">
                      <span className="font-medium">{article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{article.journal}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-stone-100 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 hover:translate-x-1 font-medium text-sm transition-all duration-300 ease-out"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found matching your search criteria.</p>
              </div>
            )}
          </div>

          {/* Growth Space Section - Separated */}
          <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t-2 border-stone-200">
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-200/60">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Growth Space
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Practical resources, guides, and tools to support your mental health growth journey.
                </p>
              </div>

            {/* Growth Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {growthCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedGrowthCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ease-out ${
                    selectedGrowthCategory === category
                      ? 'bg-emerald-600 text-white scale-105'
                      : 'bg-stone-50 text-slate-700 hover:bg-stone-100 hover:scale-105 hover:-translate-y-0.5'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Growth Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrowthResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="growth-card card bg-stone-50 shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] hover:border-emerald-300/60 hover:scale-[1.03] hover:-translate-y-3 transition-all duration-300 ease-out border border-stone-200/60 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (resource.url) {
                      window.open(resource.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && resource.url) {
                      e.preventDefault();
                      window.open(resource.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  {resource.image && (
                    <div className="w-full h-40 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                        {resource.icon}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-slate-500 uppercase">
                          {resource.type}
                        </span>
                        <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {resource.category}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {resource.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <div className="pt-4 border-t border-stone-200">
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">
                        {resource.content}
                      </p>
                      {resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 hover:translate-x-1 font-medium text-sm transition-all duration-300 ease-out"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explore Resource
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 text-sm">
                          Resource available soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Infographics Section - Separated */}
          <section className="mt-24 md:mt-32 pt-16 md:pt-20 border-t-2 border-stone-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Mental Health Infographics
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Visual insights and data-driven information about mental health trends and statistics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Infographic 1 */}
              <div 
                className="article-card card bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out border border-blue-200/60 overflow-hidden cursor-pointer"
                onClick={() => window.open('https://www.who.int/publications/i/item/9789240049338', '_blank', 'noopener,noreferrer')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                    e.preventDefault();
                    window.open('https://www.who.int/publications/i/item/9789240049338', '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Global Mental Health Statistics</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">People with mental disorders</span>
                      <span className="font-bold text-blue-600">970M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">Annual suicides</span>
                      <span className="font-bold text-blue-600">700K+</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">Treatment gap (low-income)</span>
                      <span className="font-bold text-red-600">88%</span>
                    </div>
                  </div>
                  <div
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 hover:translate-x-1 font-medium text-sm transition-all duration-300 ease-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href="https://www.who.int/publications/i/item/9789240049338"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      View Full Report
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Infographic 2 */}
              <div 
                className="article-card card bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out border border-purple-200/60 overflow-hidden cursor-pointer"
                onClick={() => window.open('https://www.who.int/publications/i/item/9789240114487', '_blank', 'noopener,noreferrer')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                    e.preventDefault();
                    window.open('https://www.who.int/publications/i/item/9789240114487', '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Treatment Coverage by Income</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">High-income</span>
                        <span className="font-bold text-green-600">70%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Middle-income</span>
                        <span className="font-bold text-yellow-600">35%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Low-income</span>
                        <span className="font-bold text-red-600">12%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700 hover:translate-x-1 font-medium text-sm transition-all duration-300 ease-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href="https://www.who.int/publications/i/item/9789240114487"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      Learn More
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Infographic 3 */}
              <div 
                className="article-card card bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out border border-emerald-200/60 overflow-hidden cursor-pointer"
                onClick={() => window.open('https://ourworldindata.org/mental-health', '_blank', 'noopener,noreferrer')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                    e.preventDefault();
                    window.open('https://ourworldindata.org/mental-health', '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Common Mental Health Conditions</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <span>Depression</span>
                      <span className="font-bold text-emerald-600">~280M</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <span>Anxiety Disorders</span>
                      <span className="font-bold text-emerald-600">~301M</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <span>Bipolar Disorder</span>
                      <span className="font-bold text-emerald-600">~40M</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <span>Schizophrenia</span>
                      <span className="font-bold text-emerald-600">~24M</span>
                    </div>
                  </div>
                  <div
                    className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700 hover:translate-x-1 font-medium text-sm transition-all duration-300 ease-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href="https://ourworldindata.org/mental-health"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      Explore Data
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchPage;

