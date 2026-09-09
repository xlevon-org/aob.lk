import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface EbookItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  image: string;
  srcSet?: string;
  alt?: string;
}

const EBOOKS_LIST: EbookItem[] = [
  {
    "id": "ebook-1",
    "title": "7 trading themes for 2026",
    "description": "Discover the key trends and patterns set to shape the financial markets in 2026 with this insightful ebook.",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-7trading-themes-en.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes.png",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-500.png 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-800.png 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-1080.png 1080w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-1600.png 1600w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-2000.png 2000w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-2600.png 2600w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes-p-3200.png 3200w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6940f3f445cd64d2e33af107_7%20Trading%20Themes.png 4000w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-2",
    "title": "How to trade stocks the smart way",
    "description": "Discover how to trade stocks the smart way with our ebook for beginners.",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-stocks-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f66fda5fde2275734733_how%20to%20trade%20stocks.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f66fda5fde2275734733_how%20to%20trade%20stocks-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f66fda5fde2275734733_how%20to%20trade%20stocks-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f66fda5fde2275734733_how%20to%20trade%20stocks.webp 824w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-3",
    "title": "How to trade the forex market",
    "description": "A pdf guide to currency trading for beginners to help apply informed trading strategies",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-forex-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3ee192f3369b4bf5ad7_how-to-trade-forex.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3ee192f3369b4bf5ad7_how-to-trade-forex-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3ee192f3369b4bf5ad7_how-to-trade-forex-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3ee192f3369b4bf5ad7_how-to-trade-forex.webp 836w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-4",
    "title": "10 Trading chart patterns every trader should know",
    "description": "Identify &amp; read candlestick charts with this pdf and make more informed trades",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-10chart-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f687ffeb590b7856a3c3_10%20trading%20charts%20patters.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f687ffeb590b7856a3c3_10%20trading%20charts%20patters-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f687ffeb590b7856a3c3_10%20trading%20charts%20patters-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f687ffeb590b7856a3c3_10%20trading%20charts%20patters.webp 824w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-5",
    "title": "How to trade synthetic indices",
    "description": "Learn to develop an effective synthetic indices trading strategy.",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-synthetics-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/67eb55dfa1d5739ffa0dd473_synthetics-ebook-cover.webp",
    "srcSet": "",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-6",
    "title": "How to trade cryptocurrencies with Deriv",
    "description": "Explore our crypto trading guide for details about risk management and order types.",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-crypto-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f4127368056180901578_how-to-trade-cryptocurrencies.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f4127368056180901578_how-to-trade-cryptocurrencies-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f4127368056180901578_how-to-trade-cryptocurrencies-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f4127368056180901578_how-to-trade-cryptocurrencies.webp 832w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-7",
    "title": "Trading accumulator options with Deriv",
    "description": "Understand the basics of Deriv accumulators with this options trading ebook for beginners",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-accumulators-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3c39bad274585f50dfe_trade%20accumulator%20options.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3c39bad274585f50dfe_trade%20accumulator%20options-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3c39bad274585f50dfe_trade%20accumulator%20options-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f3c39bad274585f50dfe_trade%20accumulator%20options.webp 824w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-8",
    "title": "7 traits of successful financial traders",
    "description": "Discover the traits of a successful trader in this pdf",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-7traits-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f45069e0ca018dff061a_7%20traits%20of%20successful%20traders.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f45069e0ca018dff061a_7%20traits%20of%20successful%20traders-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f45069e0ca018dff061a_7%20traits%20of%20successful%20traders-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f45069e0ca018dff061a_7%20traits%20of%20successful%20traders.webp 824w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  },
  {
    "id": "ebook-9",
    "title": "How to trade commodities",
    "description": "Learn the basics of commodity trading with this pdf and place better trades",
    "pdfUrl": "https://docs.deriv.com/marketing/2025/ebook-commodities-en-hq.pdf",
    "image": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f42ff761cad66f9dfdd9_how%20to%20trade%20commodities.webp",
    "srcSet": "https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f42ff761cad66f9dfdd9_how%20to%20trade%20commodities-p-500.webp 500w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f42ff761cad66f9dfdd9_how%20to%20trade%20commodities-p-800.webp 800w, https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/68f9f42ff761cad66f9dfdd9_how%20to%20trade%20commodities.webp 824w",
    "alt": "Cover of eBook &quot;Introduction to Trading Financial Accumulator Options with Deriv&quot; by Vince Stanzione, featuring an upward arrow."
  }
];

export const EbooksView: React.FC = () => {
  const { navigate, setEbookModalItem, setDemoAccountModalOpen, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const filteredEbooks = EBOOKS_LIST.filter((eb) =>
    eb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (e: React.MouseEvent, ebook: EbookItem) => {
    const target = e.target as HTMLElement;
    if (target.closest('.academy-card_button-wrap')) {
      return;
    }
    setEbookModalItem({
      id: ebook.id,
      slug: ebook.id,
      title: ebook.title,
      subtitle: ebook.description,
      description: ebook.description,
      category: 'trading',
      categoryLabel: 'Trading Ebook',
      author: 'Deriv Market Research Team',
      authorRole: 'Senior Quantitative Analysts',
      pageCount: 54,
      fileSize: '5.4 MB',
      coverImage: ebook.image,
      downloadCount: '45,000+',
      featured: true,
      tableOfContents: [
        'Chapter 1: Foundations and Market Dynamics',
        'Chapter 2: Core Analysis Methodologies',
        'Chapter 3: Strategic Setup Formulation',
        'Chapter 4: Position Sizing and Capital Preservation',
        'Chapter 5: Psychology of High-Probability Execution',
        'Chapter 6: Practical Checklists and Rules'
      ],
      keyHighlights: [
        'Actionable frameworks vetted by seasoned institutional practitioners.',
        'Clear graphic breakdowns and diagrammatic illustrations.',
        'Risk matrices to calculate exact contract sizing per market move.'
      ],
      sampleExcerpt: 'Success in modern financial trading is a function of methodical risk discipline, emotional endurance, and adherence to proven mathematical edges.'
    });
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
            <div className="bread-crumb_link is-light">Trading ebooks</div>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="section_guides-hero with-bread-crumbs">
        <div className="guides-hero_component">
          <div className="container">
            <div className="guides-hero_text-wrap">
              <h1 className="heading-style-h1">Trading ebooks</h1>
              <p>
                Discover how seasoned traders think, plan, and adapt in real market conditions. Our trading books for beginners offer in-depth explanations and visual breakdowns to help build your trading knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-cta_interaction-trigger">
        {/* Ebooks Grid */}
        <section className="section_guides-list padding-bottom-md">
          <div className="guides-list_component">
            <div className="container">
              <div className="guides-list_content">
                <div className="guides-list_wraper w-dyn-list">
                  <div
                    fs-cmsload-element="list"
                    fs-cmsfilter-element="list"
                    fs-cmsload-mode="pagination"
                    role="list"
                    className="guides-list_list w-dyn-items"
                  >
                    {filteredEbooks.map((ebook) => (
                      <div
                        key={ebook.id}
                        role="listitem"
                        className="guides-list_item w-dyn-item"
                        onClick={(e) => handleCardClick(e, ebook)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="academy-card_component">
                          <a
                            href={ebook.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="academy-card_link w-inline-block"
                          >
                            <div className="ebook_image-wrapper">
                              <img
                                alt={ebook.alt || ebook.title}
                                loading="lazy"
                                src={ebook.image}
                                sizes="100vw"
                                srcSet={ebook.srcSet || undefined}
                                className="academy-ebook_image"
                              />
                            </div>
                            <div className="academy-card_content">
                              <h3 data-traking="button-text" fs-cmsfilter-field="name" className="heading-style-h6">
                                {ebook.title}
                              </h3>
                              <p>{ebook.description}</p>
                            </div>
                          </a>
                          <div className="academy-card_button-wrap">
                            <a
                              data-wf--design-system-enterprise-copy--link-arrow--variant="coral"
                              href={ebook.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="design-system-enterprise-copy--link design-system-enterprise-copy--is-arrow w-inline-block"
                            >
                              <div data-traking="button-text">View PDF</div>
                              <div className="design-system-enterprise-copy--link_icon"></div>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredEbooks.length === 0 && (
                    <div fs-cmsfilter-element="empty" className="guides-list_empty-block">
                      <div className="guides-list_empty-text">No results found</div>
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
