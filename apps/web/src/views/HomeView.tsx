import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeHero } from '../components/home/HomeHero';
import { HomeCoursesSection } from '../components/home/HomeCoursesSection';
import { HomeNewsBanner } from '../components/home/HomeNewsBanner';
import { HomeGuidesSection } from '../components/home/HomeGuidesSection';
import { HomeEbooksSection } from '../components/home/HomeEbooksSection';
import { HomeExpertBanner } from '../components/home/HomeExpertBanner';
import { HomeVideosSection } from '../components/home/HomeVideosSection';
import { HomeGlossarySection } from '../components/home/HomeGlossarySection';
import { HomeStepsSection } from '../components/home/HomeStepsSection';
import { HomeCtaSlider } from '../components/home/HomeCtaSlider';
import { HomeMessengers } from '../components/home/HomeMessengers';

export const HomeView: React.FC = () => {
  const { navigate } = useApp();

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div onClick={handleContainerClick} className="main-wrapper">
      <div className="messengers_interaction-trigger"></div>
      <HomeHero />
      <HomeCoursesSection />
      <HomeNewsBanner />
      <div className="bottom-cta_interaction-trigger">
        <HomeGuidesSection />
        <HomeEbooksSection />
        <HomeExpertBanner />
        <HomeVideosSection />
        <HomeGlossarySection />
      </div>
      <HomeMessengers />
      <HomeStepsSection />
      <HomeCtaSlider />
    </div>
  );
};
