import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GUIDES_DATA, GuideItem } from '../data/guides';

interface ArticleDetailViewProps {
  slug?: string;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ slug }) => {
  const { currentParams, navigate, showToast } = useApp();
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [copied, setCopied] = useState<boolean>(false);

  const activeSlug = slug || currentParams.articleSlug || 'how-to-connect-your-deriv-account-to-tradingview';
  const guide: GuideItem =
    GUIDES_DATA.find((g) => g.slug === activeSlug) ||
    GUIDES_DATA.find((g) => g.slug.includes(activeSlug)) ||
    GUIDES_DATA[3]; // Default to TradingView guide

  // Related guides (exclude current)
  const relatedGuides = GUIDES_DATA.filter((g) => g.id !== guide.id).slice(0, 3);

  // Scroll listener for TOC active highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'why-connect', 'before-you-start', 'how-to-setup', 'next-steps'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Guide link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToSection = (e: React.MouseEvent, secId: string) => {
    e.preventDefault();
    const el = document.getElementById(secId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(secId);
    }
  };

  return (
    <div className="main-content-guide-detail">
      <div className="main-wrapper">
        <div className="messengers_interaction-trigger"></div>

        {/* 1. Breadcrumbs */}
        <section className="section_bread-crumb is-lesson">
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
              <a
                href="/trading-guides"
                onClick={(e) => { e.preventDefault(); navigate('/trading-guides'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                className="bread-crumb_link is-mobile-hidden"
              >
                Trading guides
              </a>
              <div className="bread-crumb_ellipsis">...</div>
              <div className="bread-crumb_link is-light is-icon"></div>
              <div className="bread-crumb_link is-light">{guide.title}</div>
            </div>
          </div>
        </section>

        {/* 2. Hero */}
        <section className="section_guide-hero have-toc is-no-padding">
          <div className="container">
            <div className="guide-hero_component">
              <div className="hero-slider_content-wrap is-course">
                <div className="hero-slider_text-wrap">
                  <div className="hero-slider_text-wrap-inner">
                    <h1 className="heading-style-h2 is-text-white">{guide.title}</h1>
                    <div className="academy-card_info-wrap">
                      <div className="academy-card_info-block is-hero">
                        <div className="academy-card_info-icon"></div>
                        <div className="academy-card_info-text-wrap">
                          <div className="academy-card_info-text">{guide.readTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="guide-hero_background-wrapper">
                <div className="guide-hero_overlay-2"></div>
                <div className="guide-hero_overlay-1"></div>
                <img
                  width="1080"
                  alt={guide.title}
                  src={guide.image}
                  className="guide-hero_background-image"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6a0fac06fe911070b6ed210a_6a0e5aa4c8b25e29769f8fdc_20May.webp';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Guide Content with Sticky TOC Sidebar */}
        <section className="section_guide-content padding-vertical-md">
          <div className="guide-content_component">
            <div className="container">
              <div className="fs-toc_example">
                {/* Left Column: Sticky TOC Sidebar */}
                <div className="fs-toc_sidebar">
                  <div className="guide-content_toc-wrap">
                    <div className="guide-content_toc-heading-wrap">
                      <div className="heading-style-h5">Contents</div>
                    </div>

                    <div className="fs-toc_link-content">
                      <div className="fs-toc_link-wrapper is-h2">
                        <a
                          href="#intro"
                          onClick={(e) => scrollToSection(e, 'intro')}
                          className={`fs-toc_link w-inline-block ${activeSection === 'intro' ? 'is-active' : ''}`}
                        >
                          <div className="fs-toc_label">h2</div>
                          <div fs-toc-element="link">Introduction</div>
                        </a>
                      </div>

                      <div className="fs-toc_link-wrapper is-h2">
                        <a
                          href="#why-connect"
                          onClick={(e) => scrollToSection(e, 'why-connect')}
                          className={`fs-toc_link w-inline-block ${activeSection === 'why-connect' ? 'is-active' : ''}`}
                        >
                          <div className="fs-toc_label">h2</div>
                          <div fs-toc-element="link">Key Benefits & Why It Matters</div>
                        </a>
                      </div>

                      <div className="fs-toc_link-wrapper is-h2">
                        <a
                          href="#before-you-start"
                          onClick={(e) => scrollToSection(e, 'before-you-start')}
                          className={`fs-toc_link w-inline-block ${activeSection === 'before-you-start' ? 'is-active' : ''}`}
                        >
                          <div className="fs-toc_label">h2</div>
                          <div fs-toc-element="link">Before you start</div>
                        </a>
                      </div>

                      <div className="fs-toc_link-wrapper is-h2">
                        <a
                          href="#how-to-setup"
                          onClick={(e) => scrollToSection(e, 'how-to-setup')}
                          className={`fs-toc_link w-inline-block ${activeSection === 'how-to-setup' ? 'is-active' : ''}`}
                        >
                          <div className="fs-toc_label">h2</div>
                          <div fs-toc-element="link">Step-by-Step Setup</div>
                        </a>
                      </div>

                      <div className="fs-toc_link-wrapper is-h2">
                        <a
                          href="#next-steps"
                          onClick={(e) => scrollToSection(e, 'next-steps')}
                          className={`fs-toc_link w-inline-block ${activeSection === 'next-steps' ? 'is-active' : ''}`}
                        >
                          <div className="fs-toc_label">h2</div>
                          <div fs-toc-element="link">Summary & Next Steps</div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="guide-content_social-wrap">
                    <div className="share-block_buttons">
                      <a
                        data-share="copy-url"
                        href="#"
                        onClick={handleCopy}
                        className="share-block_button w-inline-block"
                        title="Copy link"
                      >
                        <img
                          loading="lazy"
                          src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/67cea1700cf355d909787e73_a190f1469d6dbb73fed41ad1ceb32661_icon%20-%20link.svg"
                          alt="Link"
                        />
                        {copied && (
                          <div className="share-block_message-block text-size-xsmall" style={{ display: 'block' }}>
                            Copied
                          </div>
                        )}
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-block_button w-inline-block"
                        title="Share on Facebook"
                      >
                        <img
                          loading="lazy"
                          src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/67cea2cbfe9ba5aa19875fdf_1bfef2523275ee1fcf1176b66d7ad468_icon%20-%20facebook.svg"
                          alt="Facebook"
                        />
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-block_button w-inline-block"
                        title="Share on LinkedIn"
                      >
                        <img
                          loading="lazy"
                          src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/67cea2cba0e75525546059d0_68e2ee04c449ce2ffea2d9f4851221b3_icon%20-%20linkedin.svg"
                          alt="LinkedIn"
                        />
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(guide.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-block_button w-inline-block"
                        title="Share on X"
                      >
                        <img
                          loading="lazy"
                          src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/67cea2cb36a7ea7378d3885d_9fbf54cf530f90e6ff407fcf837ce74b_icon%20-%20twitter.svg"
                          alt="Twitter"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Rich Text Content */}
                <div className="fs-toc_rich-text">
                  <div fs-toc-element="contents" className="fs-toc_richtext w-richtext">
                    <div id="intro">
                      <p>{guide.summary}</p>
                      <p>
                        Whether you are an active day trader or a long-term position strategist, understanding this mechanism allows you
                        to optimize execution speed, minimize slippage, and maintain strict discipline across volatile market regimes.
                      </p>
                    </div>

                    <h2 id="why-connect">Key Benefits &amp; Why It Matters</h2>
                    <p>
                      Instead of constantly switching between third-party analytical windows and your execution portal, integration
                      delivers a unified workspace where market data, technical indicators, and order routing converge seamlessly.
                    </p>
                    <p>This is particularly valuable if you:</p>
                    <ul role="list">
                      <li>Use advanced charting tools, custom indicators, or automated alerts as part of your daily routine.</li>
                      <li>Want to react immediately to high-probability price setups without switching tabs or losing precious seconds.</li>
                      <li>Need transparent position management with real-time profit and loss tracking directly on chart candlesticks.</li>
                      <li>Trade high-frequency instruments such as Crash/Boom, Volatility Indices, or major forex pairs.</li>
                    </ul>

                    <h2 id="before-you-start">Before you start</h2>
                    <p>Before initiating the configuration, make sure you verify the following prerequisites:</p>
                    <ul role="list">
                      <li><strong>Supported Account Types:</strong> Both real and demo Deriv accounts are fully supported.</li>
                      <li><strong>Capital &amp; Balance Security:</strong> All deposits, withdrawals, and account verification remain securely hosted on Deriv. Third-party tools only access trade routing permissions.</li>
                      <li><strong>Browser Compatibility:</strong> We recommend using the latest version of Chrome, Firefox, Safari, or Edge with pop-up blockers disabled during the authentication handshake.</li>
                    </ul>

                    <figure className="w-richtext-align-fullwidth w-richtext-figure-type-image">
                      <div>
                        <img
                          src={guide.image}
                          alt={guide.title}
                          loading="lazy"
                          style={{ width: '100%', borderRadius: '12px', marginBottom: '8px' }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src = 'https://cdn.prod.website-files.com/67c5ccce25ee4e53514167ac/6a991614dd2e23a42fc4fbfc_imagegen-537e3bdf-openai__generic_2.webp';
                          }}
                        />
                      </div>
                      <figcaption className="text-size-xsmall text-[#666666] text-center">
                        {guide.title} — Overview of execution interface and operational workflow
                      </figcaption>
                    </figure>

                    <h2 id="how-to-setup">Step-by-Step Setup</h2>
                    <p>The entire setup takes under 3 minutes. Follow these consecutive steps:</p>

                    <h3>Step 1: Sign in to your Deriv Dashboard</h3>
                    <p>
                      Log in to your Deriv account. If you do not have an account yet, you can register a free demo account in seconds with $10,000 virtual funds.
                    </p>

                    <h3>Step 2: Select your Preferred Trading Platform</h3>
                    <p>
                      From the main navigation bar, navigate to the CFDs or Options tab and select the asset class you wish to trade. Ensure your leverage settings and margin requirements are configured to your risk profile.
                    </p>

                    <h3>Step 3: Establish the Integration Handshake</h3>
                    <p>
                      Follow the on-screen prompts to authorize the connection. Review the permission scopes and confirm. Once verified, your live chart and orders will synchronize instantaneously.
                    </p>

                    <div className="bg-[#f8f9fa] border-l-4 border-[#ff444f] p-4 my-6 rounded-r-md">
                      <h4 className="text-[16px] font-bold text-[#0e0e0e] m-0 mb-1">Important Risk Note</h4>
                      <p className="text-[14px] text-[#555555] m-0">
                        Trading CFDs and financial derivatives involves significant risk of loss. Always practice in a risk-free demo account before committing real capital, and utilize strict stop-loss levels.
                      </p>
                    </div>

                    <h2 id="next-steps">Summary &amp; Next Steps</h2>
                    <p>
                      With your setup active, you can now monitor real-time order books, apply Fibonacci retracements, and execute market or limit orders directly. Continue exploring our related guides below to deepen your technical edge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Related Guides Section */}
        <section className="section_guides-related padding-bottom-md">
          <div className="container">
            <div className="guides-related_component">
              <div className="guides-related_text-wrap mb-8">
                <h2 className="heading-style-h2">Related guides</h2>
              </div>

              <div className="guides-list_list w-dyn-items">
                {relatedGuides.map((item) => (
                  <div key={item.id} role="listitem" className="guides-list_item w-dyn-item">
                    <div className="academy-card_component">
                      <a
                        href={item.link}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/trading-guides/' + item.slug);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="academy-card_link w-inline-block"
                      >
                        <div className="academy-card_image-wrapper">
                          <img
                            alt={item.title}
                            loading="lazy"
                            src={item.image}
                            className="academy-card_image"
                            onError={(e) => {
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
                                <div className="academy-card_time-text">{item.readTime}</div>
                              </div>
                            </div>
                          </div>

                          <h3 className="heading-style-h6">{item.title}</h3>
                          <p>{item.summary}</p>
                        </div>
                      </a>

                      <div className="guides-list_categories-list w-dyn-list">
                        <div role="list" className="w-dyn-items">
                          <div role="listitem" className="w-dyn-item">
                            <div className="guides-list_category-name">{item.category}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Bottom Banner Slider */}
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

        {/* 6. Sticky Bottom CTA */}
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
    </div>
  );
};
