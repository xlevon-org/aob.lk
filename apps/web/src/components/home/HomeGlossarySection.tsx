import React from 'react';
import { useApp } from '../../context/AppContext';

export const HomeGlossarySection: React.FC = () => {
  const { navigate } = useApp();

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/glossary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="section_glossary-ae padding-vertical-md"><div className="container"><div className="w-layout-grid glossary_component is-ae"><div className="news_img-wrapper"><img src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9d2981e0c4d2a1189a6d3_academy-glossary.webp" loading="lazy" width="Auto" sizes="(max-width: 479px) 24vw, 115px" alt="" srcSet="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9d2981e0c4d2a1189a6d3_academy-glossary-p-500.webp 500w, https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9d2981e0c4d2a1189a6d3_academy-glossary-p-800.webp 800w, https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9d2981e0c4d2a1189a6d3_academy-glossary-p-1080.webp 1080w, https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68f9d2981e0c4d2a1189a6d3_academy-glossary.webp 1208w" className="news_img"/></div><div id="w-node-_80880996-d854-0ed9-917d-45d0467c8db7-84876d75" className="glossary_content is-ae"><h2 className="heading-style-h2">Master trading vocabulary</h2><p>Get familiar with must-know trading terms in our Glossary.</p><div className="news_button-group"><a data-wf--design-system-enterprise-copy--link-arrow--variant="coral" href="https://deriv.com/trading-terms-glossary" target="_blank" className="design-system-enterprise-copy--link design-system-enterprise-copy--is-arrow w-inline-block"><div data-traking="button-text">Explore Glossary</div><div className="design-system-enterprise-copy--link_icon"></div></a></div></div></div></div></header>
  );
};
