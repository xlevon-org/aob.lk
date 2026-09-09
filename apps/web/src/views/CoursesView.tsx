import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface CourseItem {
  id: string;
  title: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  slug: string;
  description: string;
  image: string;
  avatar: string;
}

const COURSES_LIST: CourseItem[] = [
  {
    "id": "course-1",
    "title": "Forex | Beginner",
    "category": "Beginner",
    "lessons": 12,
    "slug": "/trading-courses/forex-beginner-level",
    "description": "Start with the basics in our Forex course - from reading currency pairs and when to trade them to how spreads and leverage affect your trades.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e89682d2e349ac3e0322bd_68f9fad607bb48fc33ba3e8b_Courses%2520-%2520Forex%2520_%2520Beginner.png",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff2026cc4887836c6f0647_avatar-01.webp"
  },
  {
    "id": "course-2",
    "title": "Volatility Indices | Beginner",
    "category": "Beginner",
    "lessons": 11,
    "slug": "/trading-courses/volatility-indices-beginner-level",
    "description": "Learn about Volatility Indices \u2014 synthetic markets you can trade 24/7. Discover how they move, how to trade them, and how to manage your risk effectively.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e8966b976d5172500eb47f_68fa0509686893e21508f2e8_Courses%2520-%2520Volatitly%2520_%2520Beginner.png",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1fb08c3e8608d03263d7_avatar-04.webp"
  },
  {
    "id": "course-3",
    "title": "Deriv MT5 | Beginner",
    "category": "Beginner",
    "lessons": 10,
    "slug": "/trading-courses/mt5-trading-for-beginners",
    "description": "Learn how to navigate Deriv MT5, place trades confidently, and manage risk using basic order types and platform features designed for new traders.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e8966a223c0a87e6caa4c9_68f9fabe95425a607f14df1d_Courses%2520-%2520MT5%2520_%2520Beginner.png",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff2006933f975ac8afefbc_avatar-02.webp"
  },
  {
    "id": "course-4",
    "title": "Derivatives | Beginner",
    "category": "Beginner",
    "lessons": 7,
    "slug": "/trading-courses/derivatives-for-beginners",
    "description": "Understand what derivatives are, why traders use them, and how to trade Options on a wide range of underlying assets using Deriv\u2019s platforms.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e89669e60548e9097d91c0_68149291cd6fe44eaa8b54df_derivatives-beginner-cover.webp",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1f15127c2396ca61b130_avatar-06.webp"
  },
  {
    "id": "course-5",
    "title": "Forex | Intermediate",
    "category": "Intermediate",
    "lessons": 9,
    "slug": "/trading-courses/forex-intermediate-level",
    "description": "Discover how global events and market trends shape currency movements, then turn that insight into smarter trading decisions.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e8966ad25a7b7fcafba9ef_68f9faa4f701c5c604f0f611_Courses%2520-%2520Forex%2520_%2520Intermediate.png",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1e3515f0980392180b7a_avatar-05.webp"
  },
  {
    "id": "course-6",
    "title": "Deriv MT5 | Intermediate",
    "category": "Intermediate",
    "lessons": 7,
    "slug": "/trading-courses/mt5-intermediate-level",
    "description": "Explore how to make the most of Deriv MT5 in this free intermediate course, from setting up your charts to using indicators that suit your trading style.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e8966a688b4484ec37516f_68f9fa860825b5004578ab95_Courses%2520-%2520MT5%2520_%2520Intermediate.png",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1fc3e2e031275eca77f8_avatar-03.webp"
  },
  {
    "id": "course-7",
    "title": "Volatility Indices | Advanced",
    "category": "Advanced",
    "lessons": 9,
    "slug": "/trading-courses/volatility-indices-advanced",
    "description": "Master volatility-driven strategies and advanced risk management on Deriv MT5 with this free volatility trading course.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e89641998a7cd3324945c2_67ebdc521482a0bf18584a7e_volatility-indices-advanced.webp",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1fb08c3e8608d03263d7_avatar-04.webp"
  },
  {
    "id": "course-8",
    "title": "Derivatives | Advanced",
    "category": "Advanced",
    "lessons": 9,
    "slug": "/trading-courses/derivatives-advanced-course",
    "description": "Master advanced options strategies on Synthetic Indices like Volatility, Jump, and Daily Reset, and learn how to apply them through practical trading setups.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e89642b3fcc16a9280247a_67ebe89d60c9611b6cbf802b_derivatives-advanced-cover.webp",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1f15127c2396ca61b130_avatar-06.webp"
  },
  {
    "id": "course-9",
    "title": "Forex | Advanced",
    "category": "Advanced",
    "lessons": 10,
    "slug": "/trading-courses/forex-advanced-level",
    "description": "Master advanced Forex strategies with risk techniques grounded in market volatility, technical signals, and intermarket correlation.",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/69e8964299cfb8ffcc0d52ec_68f9fb16483fcea9103e139a_Courses%2520-%2520Forex%2520_%2520Advanced.png",
    "avatar": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67ff1e3515f0980392180b7a_avatar-05.webp"
  }
];

export const CoursesView: React.FC = () => {
  const { navigate, showToast, setDemoAccountModalOpen } = useApp();
  const [activeLevel, setActiveLevel] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const filteredCourses = activeLevel === 'all'
    ? COURSES_LIST
    : COURSES_LIST.filter((c) => c.category === activeLevel);

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    navigate(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (e: React.MouseEvent, course: CourseItem) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + course.slug;
    navigator.clipboard?.writeText(url);
    showToast(`Copied link for ${course.title}`, 'success');
  };

  return (
    <div className="main-wrapper">
      <div className="messengers_interaction-trigger"></div>

      {/* Breadcrumb */}
      <section className="section_bread-crumb">
        <div className="container">
          <div className="bread-crumb_wrapper">
            <a href="https://deriv.com/" className="bread-crumb_link">Home</a>
            <div className="bread-crumb_link is-light is-icon"></div>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bread-crumb_link"
            >
              Academy
            </a>
            <div className="bread-crumb_link is-light is-icon"></div>
            <div className="bread-crumb_link is-light">Trading courses</div>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="section_guides-hero with-bread-crumbs">
        <div className="guides-hero_component">
          <div className="container">
            <div className="guides-hero_text-wrap">
              <h1 className="heading-style-h1">Trading courses</h1>
              <p>
                Our expert-led courses cover core concepts, trading strategies, and more with actionable insights tailored to your level. Learn at your pace, revisit what matters, and apply what you learn directly to your trades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-cta_interaction-trigger">
        {/* Filter */}
        <section className="section_academy-filter">
          <div className="academy-filter_component">
            <div className="container">
              <div className="academy-filter_content">
                <div fs-cmsfilter-element="filters" className="academy-filter_form-block w-form">
                  <div className="academy-filter_form">
                    <div className="academy-filter_input-wrapper">
                      <div className="academy-filter_input-block">
                        <div fs-cmsfilter-field="" className="academy-filter_categories-block">
                          <label
                            className="filter-button_component w-radio"
                            onClick={() => setActiveLevel('all')}
                            style={{ cursor: 'pointer' }}
                          >
                            <input
                              type="radio"
                              name="radio"
                              id="radio-all"
                              className="w-form-formradioinput filter-button_checkbox w-radio-input"
                              checked={activeLevel === 'all'}
                              onChange={() => setActiveLevel('all')}
                              value="all"
                            />
                            <span className="filter-button_name text-size-xsmall w-form-label">
                              View All
                            </span>
                          </label>

                          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                            <label
                              key={lvl}
                              className="design-system-enterprise-copy--filter-button_component w-radio"
                              onClick={() => setActiveLevel(lvl)}
                              style={{ cursor: 'pointer' }}
                            >
                              <input
                                type="radio"
                                name="radio"
                                id={`radio-${lvl}`}
                                className="w-form-formradioinput design-system-enterprise-copy--filter-button_checkbox w-radio-input"
                                checked={activeLevel === lvl}
                                onChange={() => setActiveLevel(lvl)}
                                value={lvl}
                              />
                              <span className="design-system-enterprise-copy--filter-button_name design-system-enterprise-copy--text-size-xsmall w-form-label">
                                {lvl}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses List */}
        <section className="section_guides-list padding-bottom-md">
          <div className="guides-list_component">
            <div className="container">
              <div className="guides-list_content">
                <div className="guides-list_wraper w-dyn-list">
                  <div fs-cmsfilter-element="list" role="list" className="guides-list_list w-dyn-items">
                    {filteredCourses.map((course) => (
                      <div key={course.id} role="listitem" className="guides-list_item w-dyn-item">
                        <a
                          href={course.slug}
                          onClick={(e) => handleCardClick(e, course.slug)}
                          className="academy-card_link w-inline-block"
                        >
                          <div className="academy-card_image-wrapper">
                            <img
                              loading="lazy"
                              src={course.image}
                              alt={course.title}
                              className="academy-card_image"
                            />
                            <img
                              src={course.avatar}
                              loading="lazy"
                              alt=""
                              className="avatar-image"
                            />
                          </div>
                          <div className="academy-card_content">
                            <div className="academy-card_info-wrap">
                              <div className="academy-card_info-block">
                                <div className="academy-card_info-icon"></div>
                                <div className="academy-card_info-text-wrap">
                                  <div fs-cmsfilter-field="category" className="academy-card_info-text">
                                    {course.category}
                                  </div>
                                </div>
                              </div>
                              <div className="academy-card_info-block">
                                <div className="academy-card_info-icon"></div>
                                <div className="academy-card_info-text-wrap">
                                  <div className="academy-card_info-text">{course.lessons}</div>
                                  <div className="academy-card_info-text">lessons</div>
                                </div>
                              </div>
                              <div
                                data-share="copy-url"
                                className="share-block_button is-card"
                                onClick={(e) => handleShare(e, course)}
                                title="Copy link"
                                style={{ cursor: 'pointer' }}
                              >
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/67cea1700cf355d909787e73_a190f1469d6dbb73fed41ad1ceb32661_icon%20-%20link.svg"
                                  alt=""
                                />
                                <div className="share-block_code w-embed w-script"></div>
                              </div>
                            </div>
                            <h3 data-traking="button-text" fs-cmsfilter-field="name" className="heading-style-h6">
                              {course.title}
                            </h3>
                            <p>{course.description}</p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>

                  {filteredCourses.length === 0 && (
                    <div fs-cmsfilter-element="empty" className="guides-list_empty-block">
                      <div className="guides-list_empty-text">No courses found matching this filter</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA Slider */}
      <section className="section">
        <div className="container">
          <div data-delay="2800" data-animation="slide" className="slider-2 w-slider" data-autoplay="true" data-easing="ease">
            <div className="mask w-slider-mask">
              <div className="w-slide" style={{ display: activeSlide === 0 ? 'block' : 'none', opacity: 1, transition: 'opacity 300ms ease' }}>
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
                                data-wf--design-system-enterprise-copy--button--variant="white-solid"
                                href="https://tradersview.deriv.com/?utm_source=academy&utm_medium=organic&utm_campaign=tradersview-website-banners"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="design-system-enterprise-copy--button w-variant-302dfc91-038f-842e-63e4-bf8e89af8ce4 w-inline-block"
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
              <div className="w-slide" style={{ display: activeSlide === 1 ? 'block' : 'none', opacity: 1, transition: 'opacity 300ms ease' }}>
                <div>
                  <div className="cta-card-wrapper">
                    <div className="cta-section cta-v18 coral">
                      <div className="container-default z-index-1 w-container">
                        <div className="w-layout-grid grid-2-columns cta-v8">
                          <div className="step_card-content-top">
                            <div className="step_card-top-block">
                              <h3 className="heading-style-h3-card stack-card-header is-text-white">
                                <strong>Join 3M+ global traders</strong>
                              </h3>
                              <div className="design-system-enterprise-copy--auth_component">
                                <div className="design-system-enterprise-copy--auth_wrapper">
                                  <div className="design-system-enterprise-copy--auth_button_wrapper">
                                    <a
                                      data-wf--design-system-enterprise-copy--button--variant="black-solid"
                                      href="#"
                                      onClick={(e) => { e.preventDefault(); setDemoAccountModalOpen(true); }}
                                      className="design-system-enterprise-copy--button w-variant-025d4384-3705-8224-2479-fb541f46790a w-inline-block"
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
                        </div>
                      </div>
                      <div className="half-bg-image-right width-46 cta-v19 second"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="w-slider-arrow-left"
              onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-icon-slider-left"></div>
            </div>
            <div
              className="w-slider-arrow-right"
              onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-icon-slider-right"></div>
            </div>
            <div className="testimonial7_slide-nav w-slider-nav w-round">
              <div
                className={`w-slider-dot ${activeSlide === 0 ? 'w-active' : ''}`}
                onClick={() => setActiveSlide(0)}
                style={{ cursor: 'pointer' }}
              ></div>
              <div
                className={`w-slider-dot ${activeSlide === 1 ? 'w-active' : ''}`}
                onClick={() => setActiveSlide(1)}
                style={{ cursor: 'pointer' }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Actions */}
      <div data-wf--bottom-cta--variant="base" className="bottom-cta_component">
        <div className="bottom-cta_wrapper">
          <div className="design-system-enterprise-copy--auth_component">
            <div className="design-system-enterprise-copy--auth_wrapper">
              <div className="design-system-enterprise-copy--auth_button_wrapper">
                <a
                  data-wf--design-system-enterprise-copy--button--variant="coral-solid"
                  href="#"
                  onClick={(e) => { e.preventDefault(); setDemoAccountModalOpen(true); }}
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
            fetchPriority="high"
            alt="WhatsApp"
            className="messengers_icon"
          />
        </a>
        <a
          id="live_chat-wrapper"
          href="#"
          onClick={(e) => { e.preventDefault(); showToast('Connecting to 24/7 Live Support...', 'info'); }}
          className="messengers_button w-inline-block"
        >
          <img
            loading="lazy"
            src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68469407556ed21f1cb0bb8c_1c47ed759d2ecf5daf165be7d045e79e_message-lines-md.svg"
            alt="Live Chat"
            className="messengers_icon"
          />
        </a>
        <div className="messengers_cta-button-gap"></div>
      </div>
    </div>
  );
};
