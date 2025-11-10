import React from 'react';
import Navbar from './Navbar';
import ResourcesSection from './ResourcesSection';
import Footer from './Footer';

const ResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="pt-16 md:pt-20" />
      <ResourcesSection />
      <Footer />
    </div>
  );
};

export default ResourcesPage;



