import React from 'react';
import { useApp } from '../../context/AppContext';

export const HomeHero: React.FC = () => {
  const { navigate } = useApp();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="section_bread-crumb is-home">
        <div className="container">
          <div className="bread-crumb_wrapper">
            <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="bread-crumb_link is-text-white">
              Home
            </a>
            <div className="bread-crumb_link is-light-white is-icon"></div>
            <div className="bread-crumb_link is-text-white is-light">Academy of Binary (AOB)</div>
          </div>
        </div>
      </section>
      <div className="section_hero_markets">
        <div className="home-hero_component">
          <div className="container">
            <div className="home-hero_content_align-centre is-commodities">
              <div className="home-hero_background-wrapper_align-centre is-no-radius">
                <div className="home-hero_background-align-centre is-commodities"></div>
                <img
                  width="2400"
                  loading="lazy"
                  alt="Academy of Binary trading education and automated Deriv bot"
                  src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9ba446c091e460dfb01e0_section_hero_academy.webp"
                  className="home-hero_background-image-align-centre is-forex"
                />
              </div>
              <div className="home-hero_background-wrapper_align-centre is-radius">
                <div className="home-hero_background-align-centre is-commodities"></div>
                <img
                  width="2400"
                  loading="lazy"
                  alt="Academy of Binary trading education and automated Deriv bot"
                  src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9ba446c091e460dfb01e0_section_hero_academy.webp"
                  className="home-hero_background-image-align-centre is-forex"
                />
              </div>
              <div className="home-hero_text-wrapper-align-centre is-full-height">
                <div className="hero_header_align-centre is-academy">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#ff444f] animate-pulse"></span>
                    Official Deriv Promoter • Bandarawela, Sri Lanka
                  </div>
                  <h1 className="home-hero_heading is-ae">
                    <strong>Master Binary & Synthetic Trading with Academy of Binary</strong>
                  </h1>
                  <p className="home-hero_text">
                    Professional trading education, proven price action strategies, and automated Deriv trading bots from Academy of Binary (AOB). Transform market complexity into consistent profits.
                  </p>
                </div>
                <div className="hero-slider_button-wrap is-hero">
                  <a
                    data-wf--design-system-enterprise-copy--button--variant="coral-solid"
                    href="/trading-courses"
                    onClick={(e) => handleLinkClick(e, '/trading-courses')}
                    className="design-system-enterprise-copy--button w-inline-block cursor-pointer"
                  >
                    <div data-traking="button-text" className="design-system-enterprise-copy--button_text">
                      Explore Courses
                    </div>
                  </a>
                  <a
                    data-wf--design-system-enterprise-copy--button--variant="white-border"
                    href="https://bot.deriv.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-system-enterprise-copy--button w-variant-3f92fc24-5a37-0628-4d17-b871e8981323 w-inline-block"
                  >
                    <div data-traking="button-text" className="design-system-enterprise-copy--button_text flex items-center gap-2">
                      <span>Launch Deriv Bot</span>
                      <span>↗</span>
                    </div>
                  </a>
                </div>
                <div className="home-hero_bottom-image-block">
                  <img
                    sizes="(max-width: 1224px) 100vw, 1224px"
                    srcSet="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68fb0fb185eb8d82b428735a_academyrow-person-p-500.webp 500w, https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68fb0fb185eb8d82b428735a_academyrow-person-p-800.webp 800w, https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68fb0fb185eb8d82b428735a_academyrow-person-p-1080.webp 1080w, https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68fb0fb185eb8d82b428735a_academyrow-person.webp 1224w"
                    alt="Academy of Binary Student"
                    src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68fb0fb185eb8d82b428735a_academyrow-person.webp"
                    loading="lazy"
                    className="home-hero_bottom-image"
                  />
                </div>
              </div>
              <div data-w-id="5d790351-6a5c-3b59-e6f3-0d38d858d5d7" className="home-hero_interaction-trigger"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
