import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GUIDES_DATA, GuideItem } from '../data/guides';

const CATEGORIES = [
  { id: 'all', label: 'View All' },
  { id: 'Forex', label: 'Forex' },
  { id: 'Copytrading', label: 'Copytrading' },
  { id: 'ETFs', label: 'ETFs' },
  { id: 'Commodities', label: 'Commodities' },
  { id: 'Indices', label: 'Indices' },
  { id: 'CFDs & Options', label: 'CFDs & Options' },
  { id: 'Stocks', label: 'Stocks' },
  { id: 'TradingView', label: 'TradingView' },
  { id: 'Risk Management', label: 'Risk Management' },
  { id: 'Trading Strategies', label: 'Trading Strategies' },
  { id: 'MT5', label: 'MT5' },
  { id: 'Crypto', label: 'Crypto' },
];

const ITEMS_PER_PAGE = 9;

export const ArticlesView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter guides based on search query and selected category
  const filteredGuides = useMemo(() => {
    return GUIDES_DATA.filter((guide) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        guide.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'CFDs & Options' && (guide.category.includes('CFD') || guide.category.includes('Options')));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.summary.toLowerCase().includes(q) ||
        guide.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredGuides.length / ITEMS_PER_PAGE));
  const currentGuides = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuides.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredGuides, currentPage]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const listEl = document.querySelector('.section_guides-list');
      if (listEl) {
        listEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }
  };

  const handleCopyUrl = (e: React.MouseEvent, guide: GuideItem) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = window.location.origin + '/trading-guides/' + guide.slug;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedId(guide.id);
    showToast('Guide link copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    navigate('/trading-guides/' + slug);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="main-wrapper">
      <div className="messengers_interaction-trigger"></div>

        {/* 1. Breadcrumbs */}
        <section className="section_bread-crumb">
          <div className="container">
            <div className="bread-crumb_wrapper">
              <a href="https://deriv.com/" className="bread-crumb_link">Home</a>
              <div className="bread-crumb_link is-light is-icon"></div>
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                className="bread-crumb_link"
              >
                Academy
              </a>
              <div className="bread-crumb_link is-light is-icon"></div>
              <div className="bread-crumb_link is-light">Trading guides</div>
            </div>
          </div>
        </section>

        {/* 2. Hero */}
        <section className="section_guides-hero with-bread-crumbs">
          <div className="guides-hero_component">
            <div className="container">
              <div className="guides-hero_text-wrap">
                <h1 className="heading-style-h1">Trading guides</h1>
                <p>
                  Get clear, direct answers to common trading questions. Our free guides give you a clear,
                  step-by-step overview of concepts, tools, strategies, and market behaviour.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bottom-cta_interaction-trigger">
          {/* 3. Academy Filter with Search & Category Pills */}
          <section className="section_academy-filter">
            <div className="academy-filter_component">
              <div className="container">
                <div className="academy-filter_content">
                  <div fs-cmsfilter-element="filters" className="academy-filter_form-block w-form">
                    <form
                      id="email-form"
                      name="email-form"
                      data-name="Email Form"
                      onSubmit={(e) => e.preventDefault()}
                      className="academy-filter_form"
                      data-wf-page-id="67c87b4357bae38d8ff2da1b"
                      data-wf-element-id="8c3ef1d3-12b8-bc6d-6814-55924d025a0a"
                    >
                      {/* Search Keyword Input */}
                      <div className="ts_search-keyword-search">
                        <input
                          className="ts_search-form-input w-input"
                          maxLength={256}
                          name="search"
                          placeholder="Search"
                          type="text"
                          id="guide-search"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                      </div>

                      {/* Category Pills */}
                      <div className="academy-filter_categories-wrapper">
                        {/* View All Button */}
                        <label
                          className={`filter-button_component w-radio cursor-pointer ${
                            selectedCategory === 'all' ? 'is-active' : ''
                          }`}
                          onClick={() => handleCategoryChange('all')}
                        >
                          <input
                            type="radio"
                            name="category-radio"
                            id="radio-all"
                            className="w-form-formradioinput filter-button_checkbox w-radio-input"
                            checked={selectedCategory === 'all'}
                            onChange={() => handleCategoryChange('all')}
                          />
                          <span
                            data-traking="button-text"
                            className={`filter-button_name text-size-xsmall w-form-label ${
                              selectedCategory === 'all' ? 'font-bold' : ''
                            }`}
                          >
                            View All
                          </span>
                        </label>

                        {/* Category List */}
                        <div className="w-dyn-list">
                          <div role="list" className="categories-block w-dyn-items">
                            {CATEGORIES.slice(1).map((cat) => {
                              const isSelected = selectedCategory === cat.id;
                              return (
                                <div key={cat.id} role="listitem" className="w-dyn-item">
                                  <label
                                    className={`design-system-enterprise-copy--filter-button_component w-radio cursor-pointer ${
                                      isSelected ? 'is-active' : ''
                                    }`}
                                    onClick={() => handleCategoryChange(cat.id)}
                                  >
                                    <input
                                      type="radio"
                                      id={`radio-${cat.id}`}
                                      name="category-radio"
                                      className="w-form-formradioinput design-system-enterprise-copy--filter-button_checkbox w-radio-input"
                                      checked={isSelected}
                                      onChange={() => handleCategoryChange(cat.id)}
                                    />
                                    <span
                                      data-traking="button-text"
                                      className={`design-system-enterprise-copy--filter-button_name design-system-enterprise-copy--text-size-xsmall w-form-label ${
                                        isSelected ? 'font-bold' : ''
                                      }`}
                                    >
                                      {cat.label}
                                    </span>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Guides Cards Grid */}
          <section className="section_guides-list padding-bottom-md">
            <div className="guides-list_component">
              <div className="container">
                <div className="guides-list_content">
                  <div className="guides-list_wraper w-dyn-list">
                    {currentGuides.length > 0 ? (
                      <div fs-cmsload-element="list" role="list" className="guides-list_list w-dyn-items">
                        {currentGuides.map((guide) => (
                          <div key={guide.id} role="listitem" className="guides-list_item w-dyn-item">
                            <div className="academy-card_component">
                              <a
                                href={guide.link}
                                onClick={(e) => handleCardClick(e, guide.slug)}
                                className="academy-card_link w-inline-block"
                              >
                                <div className="academy-card_image-wrapper">
                                  <img
                                    alt={guide.title}
                                    loading="lazy"
                                    src={guide.image}
                                    className="academy-card_image"
                                    onError={(e) => {
                                      // Fallback on broken image
                                      const target = e.currentTarget;
                                      target.src = 'https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6a991614dd2e23a42fc4fbfc_imagegen-537e3bdf-openai__generic_2.webp';
                                    }}
                                  />
                                </div>

                                <div className="academy-card_content">
                                  <div className="academy-card_info-wrap">
                                    <div className="academy-card_info-block">
                                      <div className="academy-card_info-icon"></div>
                                      <div className="academy-card_info-text-wrap">
                                        <div className="academy-card_time-text">{guide.readTime}</div>
                                      </div>
                                    </div>

                                    <div
                                      data-share="copy-url"
                                      className="share-block_button is-card"
                                      onClick={(e) => handleCopyUrl(e, guide)}
                                      title="Copy link to clipboard"
                                    >
                                      <img
                                        loading="lazy"
                                        src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/67cea1700cf355d909787e73_a190f1469d6dbb73fed41ad1ceb32661_icon%20-%20link.svg"
                                        alt="Share"
                                      />
                                      {copiedId === guide.id && (
                                        <div className="share-block_message-block text-size-xsmall" style={{ display: 'block' }}>
                                          Copied
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <h3 className="heading-style-h6">{guide.title}</h3>
                                  <p>{guide.summary}</p>
                                </div>
                              </a>

                              <div className="guides-list_categories-list w-dyn-list">
                                <div role="list" className="w-dyn-items">
                                  <div role="listitem" className="w-dyn-item">
                                    <div className="guides-list_category-name">{guide.category}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="guides-list_empty-block">
                        <div className="guides-list_empty-text">No results found for "{searchQuery || selectedCategory}"</div>
                        <button
                          onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                          className="mt-4 text-[14px] font-semibold text-[#ff444f] hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div role="navigation" aria-label="List" className="w-pagination-wrapper blogs_pagination-wrapper">
                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          const isCurrent = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`blogs_page w-inline-block cursor-pointer ${
                                isCurrent ? 'w--current font-bold' : ''
                              }`}
                            >
                              <div>{pageNum}</div>
                            </button>
                          );
                        })}

                        {currentPage < totalPages && (
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Next Page"
                            className="w-pagination-next blogs_next-button cursor-pointer"
                          >
                            <div className="slider_arrow-icon w-embed">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M8 5L15.57 11.6237C15.7976 11.8229 15.7976 12.1771 15.57 12.3763L8 19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </button>
                        )}

                        <div aria-label={`Page ${currentPage} of ${totalPages}`} role="heading" className="w-page-count page-count">
                          {currentPage} / {totalPages}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 5. Bottom CTA Banner Slider */}
        <section className="section">
          <div className="container">
            <div data-delay="2800" data-animation="slide" className="slider-2 w-slider" data-autoplay="true" data-duration="500" data-infinite="true">
              <div className="mask w-slider-mask">
                <div className="w-slide">
                  <div>
                    <div className="cta-card-wrapper">
                      <div className="cta-section cta-v18 dark">
                        <div className="container-default z-index-1 w-container">
                          <div className="w-layout-grid grid-2-columns cta-v8">
                            <div className="step_card-content-top">
                              <div className="step_card-top-block">
                                <h3 className="heading-style-h3-card stack-card-header is-text-white">
                                  <strong>Analyse markets with AI-powered insights</strong>
                                </h3>
                                <a
                                  href="https://tradersview.deriv.com/?utm_source=academy&utm_medium=organic&utm_campaign=tradersview-website-banners"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="design-system-enterprise-copy--button w-inline-block"
                                >
                                  <div data-traking="button-text" className="design-system-enterprise-copy--button_text">
                                    Explore TradersView
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="half-bg-image-right width-46 cta-v19 third"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Sticky Bottom CTA Pill */}
        <div data-wf--bottom-cta--variant="base" className="bottom-cta_component">
          <div className="bottom-cta_wrapper">
            <div className="design-system-enterprise-copy--auth_component">
              <div className="design-system-enterprise-copy--auth_wrapper">
                <div className="design-system-enterprise-copy--auth_button_wrapper">
                  <a
                    href="https://home.deriv.com/dashboard/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-system-enterprise-copy--button w-inline-block"
                  >
                    <div data-traking="button-text" className="design-system-enterprise-copy--button_text">
                      Open account
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Floating Messengers */}
        <div className="messengers_component">
          <a
            id="whatsapp-wrapper"
            href="https://api.whatsapp.com/send/?phone=35699578341&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="messengers_button w-inline-block"
          >
            <img
              src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68469407556ed21f1cb0bb8b_0efbadb0f7dba36b399a975b42ee71cf_whatsapp-sm.svg"
              loading="eager"
              alt="WhatsApp"
              className="messengers_icon"
            />
          </a>
          <a
            id="live_chat-wrapper"
            href="https://deriv.com"
            target="_blank"
            rel="noopener noreferrer"
            className="messengers_button w-inline-block"
          >
            <img
              loading="lazy"
              src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68469407556ed21f1cb0bb8c_1c47ed759d2ecf5daf165be7d045e79e_message-lines-md.svg"
              alt="Chat"
              className="messengers_icon"
            />
          </a>
          <div className="messengers_cta-button-gap"></div>
        </div>
      </div>
  );
};
