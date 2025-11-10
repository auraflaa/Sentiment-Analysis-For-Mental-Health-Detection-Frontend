import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Phone, 
  BookOpen, 
  Users, 
  Heart, 
  Shield,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'hotline' | 'website' | 'app' | 'community';
  url?: string;
  phone?: string;
  icon: React.ReactNode;
  color: string;
  featured?: boolean;
}

const resourcesData: Resource[] = [
  {
    id: 1,
    title: "Vandrevala Foundation Helpline",
    description: "24/7 crisis support and suicide prevention services in India",
    category: "Crisis Support",
    type: "hotline",
    phone: "18602662345",
    url: "https://www.vandrevalafoundation.com",
    icon: <Phone className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    featured: true
  },
  {
    id: 2,
    title: "Vandrevala Foundation (Alternate)",
    description: "Alternative helpline: 1800-2333-330 for 24/7 crisis support",
    category: "Crisis Support",
    type: "hotline",
    phone: "18002333330",
    icon: <Phone className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    featured: true
  },
  {
    id: 3,
    title: "The Live Love Laugh Foundation",
    description: "Mental health awareness and support resources in India",
    category: "Support Groups",
    type: "website",
    url: "https://www.thelivelovelaughfoundation.org",
    icon: <Users className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "NIMHANS",
    description: "National Institute of Mental Health and Neurosciences - India's premier mental health institute",
    category: "Education",
    type: "website",
    url: "https://www.nimhans.ac.in",
    icon: <BookOpen className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 5,
    title: "YourDOST",
    description: "Online counseling and emotional wellness platform for India",
    category: "Professional Help",
    type: "website",
    url: "https://www.yourdost.com",
    icon: <Heart className="w-6 h-6" />,
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: 6,
    title: "Wysa",
    description: "AI-powered mental health support app with therapy options",
    category: "Professional Help",
    type: "app",
    url: "https://www.wysa.io",
    icon: <Shield className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: 7,
    title: "Amaha (formerly InnerHour)",
    description: "Mental health app with self-help tools and therapy programs",
    category: "Self-Care",
    type: "app",
    url: "https://www.amahahealth.com/",
    icon: <Heart className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: 8,
    title: "Mental Health Foundation India",
    description: "Resources and support for mental health awareness in India",
    category: "Support Groups",
    type: "website",
    url: "https://mhfi.in/",
    icon: <Users className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500"
  }
];

const categories = ["All", "Crisis Support", "Support Groups", "Education", "Self-Care", "Professional Help"];

const ResourceCard: React.FC<{ resource: Resource; index: number }> = ({ resource, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
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

  const handleClick = () => {
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else if (resource.phone) {
      if (resource.phone.startsWith('Text')) {
        // For text lines, copy to clipboard
        navigator.clipboard.writeText(resource.phone);
        alert('Text number copied to clipboard!\n\nYou can now paste it in your messaging app.');
      } else {
        // For phone numbers, show confirmation before initiating call
        const formatPhone = (phone: string) => {
          // Format 11-digit numbers: 18602662345 -> 1860-2662-345
          if (phone.length === 11) {
            return `${phone.slice(0, 4)}-${phone.slice(4, 8)}-${phone.slice(8)}`;
          }
          return phone;
        };
        const phoneNumber = formatPhone(resource.phone);
        const confirmed = window.confirm(
          `Call ${resource.title}?\n\nPhone: ${phoneNumber}\n\nThis will open your phone dialer. Click OK to continue.`
        );
        if (confirmed) {
          window.location.href = `tel:${resource.phone}`;
        }
      }
    }
  };

  return (
    <div ref={cardRef} className="h-full resource-card">
      <div 
        className={`card h-full cursor-pointer group hover:scale-[1.04] hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] hover:border-primary-300/60 transition-all duration-300 ease-out ${
          resource.featured ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
        }`}
        onClick={handleClick}
      >
        {resource.featured && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-white mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 ease-out`}>
          {resource.icon}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 ease-out">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {resource.category}
          </span>
          
          <div className="flex items-center text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-all duration-300 ease-out">
            <span className="text-sm font-medium mr-1">
              {resource.type === 'hotline' ? 'Call' : 'Visit'}
            </span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourcesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const filteredResources = resourcesData.filter(resource => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - faster
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Resource card animations - faster and synchronized
      const cards = gsap.utils.toArray<HTMLElement>('.resource-card');
      cards.forEach((card, index) => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 gradient-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold font-display text-slate-800 mb-6">
            Mental Health
            <span className="block text-gradient">Resources & Support</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find the support you need with our curated list of mental health resources, 
            crisis hotlines, and professional services.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                title="Filter resources by category"
                aria-label="Filter resources by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredResources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-lg border border-primary-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Need Immediate Help?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl">
              If you're experiencing a mental health crisis, please reach out to a crisis hotline 
              or emergency services immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/survey'}
                className="btn-primary"
              >
                Take Our Assessment
              </button>
              <button 
                onClick={() => {
                  const confirmed = window.confirm(
                    'Call Vandrevala Foundation Crisis Helpline?\n\nPhone: 1860-2662-345\n\nThis will open your phone dialer. Click OK to continue.'
                  );
                  if (confirmed) {
                    window.location.href = 'tel:18602662345';
                  }
                }}
                className="btn-secondary"
              >
                Call 1860-2662-345 (Crisis Line)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
