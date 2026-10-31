import React from 'react';
import HeroSection from '../components/home/HeroSection';
import LivePreviewDemo from '../components/home/LivePreviewDemo';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CtaSection from '../components/home/CtaSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <LivePreviewDemo />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
}
