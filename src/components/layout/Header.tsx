import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DerivAcademyOfficialLogo } from '../common/DerivAcademySvg';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
];

export const Header: React.FC<HeaderProps> = () => {
  const { currentRoute, navigate } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocalesOpen, setIsLocalesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth > 991 : true);
  const localesRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoint listener
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 991;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor scroll for dual-state desktop header transitions matching Webflow a-2550 & a-2551
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 35;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close locales dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (localesRef.current && !localesRef.current.contains(e.target as Node)) {
        setIsLocalesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCoursesActive = currentRoute === '/trading-courses' || currentRoute.startsWith('/courses');
  const isGuidesActive = currentRoute === '/trading-guides' || currentRoute.startsWith('/articles');
  const isEbooksActive = currentRoute === '/trading-ebooks' || currentRoute.startsWith('/ebooks');
  const isHomeActive = currentRoute === '/';

  return (
    <div
      data-wf--design-system-enterprise-copy--navbar--variant="base"
      className="design-system-enterprise-copy--header_component"
      style={{ position: 'relative', width: '100%' }}
    >
      <div
        data-w-id="277399ff-ec09-04f1-154a-c324b566fd85"
        className="design-system-enterprise-copy--header_size-interaction-trigger"
        style={{ position: 'absolute', top: 0, height: '40px', width: '100%', pointerEvents: 'none' }}
      />

      <header
        data-w-id="277399ff-ec09-04f1-154a-c324b566fd88"
        className="design-system-enterprise-copy--header_wrapper"
        style={
          isDesktop
            ? {
                position: 'fixed',
                top: '1.25rem',
                left: 0,
                right: 0,
                zIndex: 5000,
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }
            : {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '68px',
                zIndex: 5000,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }
        }
      >
        <section
          className="design-system-enterprise-copy--header_block"
          style={
            isDesktop
              ? { width: '100%', maxWidth: '1280px', padding: '0 1rem', display: 'flex', justifyContent: 'center' }
              : { width: '100%', height: '100%', padding: '0 1rem', display: 'flex', alignItems: 'center' }
          }
        >
          <div
            className="design-system-enterprise-copy--navbar_component w-nav"
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: isDesktop ? 'center' : 'space-between',
              alignItems: 'center',
              pointerEvents: 'auto',
            }}
          >
            {/* 1. Left Side Outer Floating Logo (desktop only, appears when scrolled) */}
            {isDesktop && (
              <div
                className="design-system-enterprise-copy--navbar_left-side-wrapper"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  transform: isScrolled ? 'translateY(0%)' : 'translateY(-135%)',
                  opacity: isScrolled ? 1 : 0,
                  pointerEvents: isScrolled ? 'auto' : 'none',
                  transition: 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                }}
              >
                <div className="design-system-enterprise-copy--navbar_left-side-block">
                  <div className="design-system-enterprise-copy--navbar_side-logo">
                    <a
                      href="/"
                      onClick={(e) => handleNavClick(e, '/')}
                      className="design-system-enterprise-copy--logo_component design-system-enterprise-copy--is-academy w-inline-block"
                      aria-label="Deriv Traders Academy"
                    >
                      <div className="design-system-enterprise-copy--logo_icon design-system-enterprise-copy--is-academy w-embed">
                        <DerivAcademyOfficialLogo />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Center Main Floating Pill (Desktop) / Full-width Header Bar (Mobile) */}
            <div
              className={`design-system-enterprise-copy--navbar_main-wrapper ${isScrolled ? 'is-scrolled' : ''}`}
              style={
                isDesktop
                  ? {
                      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.92)' : '#ffffff',
                      backdropFilter: isScrolled ? 'blur(16px)' : undefined,
                      WebkitBackdropFilter: isScrolled ? 'blur(16px)' : undefined,
                      boxShadow: isScrolled
                        ? '0 10px 30px rgba(65, 70, 82, 0.12), 0 2px 8px rgba(65, 70, 82, 0.06)'
                        : '0 4px 20px rgba(65, 70, 82, 0.08)',
                      border: '1px solid rgba(65, 70, 82, 0.08)',
                      transition: 'all 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                    }
                  : {
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      padding: 0,
                    }
              }
            >
              <div className="design-system-enterprise-copy--navbar_mobile-shadow" />

              {/* Logo (in-pill for desktop, left-side for mobile) */}
              <div
                className="design-system-enterprise-copy--navbar_logo-wrapper"
                style={
                  isDesktop
                    ? {
                        maxWidth: isScrolled ? '0px' : '220px',
                        opacity: isScrolled ? 0 : 1,
                        overflow: 'hidden',
                        pointerEvents: isScrolled ? 'none' : 'auto',
                        transition: 'max-width 0.4s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                      }
                    : {
                        maxWidth: 'none',
                        opacity: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }
                }
              >
                <div className="design-system-enterprise-copy--navbar_logo">
                  <a
                    href="/"
                    onClick={(e) => handleNavClick(e, '/')}
                    className={`design-system-enterprise-copy--logo_component design-system-enterprise-copy--is-academy w-inline-block ${isHomeActive ? 'w--current' : ''}`}
                    aria-label="Deriv Traders Academy"
                  >
                    <div className="design-system-enterprise-copy--logo_icon design-system-enterprise-copy--is-academy w-embed">
                      <DerivAcademyOfficialLogo />
                    </div>
                  </a>
                </div>
              </div>

              {/* Navigation Menu (Desktop links inside pill) */}
              {isDesktop && (
                <nav
                  role="navigation"
                  className="design-system-enterprise-copy--navbar_menu w-nav-menu"
                >
                  <div className="design-system-enterprise-copy--navbar_menu-wrapper">
                    <div className="design-system-enterprise-copy--navbar_menu-content">
                      {/* Courses */}
                      <a
                        data-wf--design-system-enterprise-copy--navbar-link--variant="base"
                        href="/trading-courses"
                        onClick={(e) => handleNavClick(e, '/trading-courses')}
                        className={`design-system-enterprise-copy--navbar_menu-link w-inline-block ${isCoursesActive ? 'w--current' : ''}`}
                      >
                        <div data-traking="button-text" className="design-system-enterprise-copy--navbar_toggle-text">
                          Courses
                        </div>
                      </a>

                      {/* Guides */}
                      <a
                        data-wf--design-system-enterprise-copy--navbar-link--variant="base"
                        href="/trading-guides"
                        onClick={(e) => handleNavClick(e, '/trading-guides')}
                        className={`design-system-enterprise-copy--navbar_menu-link w-inline-block ${isGuidesActive ? 'w--current' : ''}`}
                      >
                        <div data-traking="button-text" className="design-system-enterprise-copy--navbar_toggle-text">
                          Guides
                        </div>
                      </a>

                      {/* Ebooks */}
                      <a
                        data-wf--design-system-enterprise-copy--navbar-link--variant="base"
                        href="/trading-ebooks"
                        onClick={(e) => handleNavClick(e, '/trading-ebooks')}
                        className={`design-system-enterprise-copy--navbar_menu-link w-inline-block ${isEbooksActive ? 'w--current' : ''}`}
                      >
                        <div data-traking="button-text" className="design-system-enterprise-copy--navbar_toggle-text">
                          Ebooks
                        </div>
                      </a>

                      {/* Deriv Blog (External) */}
                      <a
                        data-wf--design-system-enterprise-copy--navbar-link--variant="base"
                        href="https://deriv.com/blog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="design-system-enterprise-copy--navbar_menu-link w-inline-block"
                      >
                        <div data-traking="button-text" className="design-system-enterprise-copy--navbar_toggle-text">
                          Deriv Blog
                        </div>
                        <div className="design-system-enterprise-copy--navbar_toggle-icon"></div>
                      </a>

                      {/* Locales Dropdown */}
                      <div
                        ref={localesRef}
                        data-hover="true"
                        data-delay="0"
                        className={`design-system-enterprise-copy--navbar_locales-dropdown w-dropdown ${isLocalesOpen ? 'w--open' : ''}`}
                        onMouseEnter={() => setIsLocalesOpen(true)}
                        onMouseLeave={() => setIsLocalesOpen(false)}
                        style={{ position: 'relative' }}
                      >
                        <div
                          className="design-system-enterprise-copy--navbar_toggle w-dropdown-toggle cursor-pointer"
                          onClick={() => setIsLocalesOpen(!isLocalesOpen)}
                          aria-expanded={isLocalesOpen}
                        >
                          <div className="design-system-enterprise-copy--navbar_toggle-wrapper design-system-enterprise-copy--text-size-small design-system-enterprise-copy--is-locales">
                            <div className="design-system-enterprise-copy--navbar_toggle-icon"></div>
                            <div className="w-locales-list">
                              <div role="list" className="w-locales-items">
                                <div role="listitem" className="design-system-enterprise-copy--navbar_toggle-locale-text w-locales-item">
                                  <span className="design-system-enterprise-copy--navbar_toggle-text design-system-enterprise-copy--is-locales w--current" style={{ display: 'inline-block' }}>
                                    {currentLang}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Menu */}
                        <nav
                          className={`design-system-enterprise-copy--navbar_dropdown-content design-system-enterprise-copy--is-locales w-dropdown-list ${isLocalesOpen ? 'w--open' : ''}`}
                          style={{
                            display: isLocalesOpen ? 'block' : 'none',
                            opacity: isLocalesOpen ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                            zIndex: 5100,
                          }}
                        >
                          <div className="design-system-enterprise-copy--navbar_dropdown-wrapper design-system-enterprise-copy--is-locales">
                            <div className="design-system-enterprise-copy--navbar_dropdown-locales">
                              <div className="design-system-enterprise-copy--navbar_locales-wrapper w-locales-list">
                                <div role="list" className="design-system-enterprise-copy--navbar_locales-list w-locales-items">
                                  {LOCALES.map((locale) => (
                                    <div key={locale.code} role="listitem" className="w-locales-item">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCurrentLang(locale.code);
                                          setIsLocalesOpen(false);
                                        }}
                                        className={`design-system-enterprise-copy--navbar_link design-system-enterprise-copy--text-size-small w-inline-block text-left w-full cursor-pointer ${currentLang === locale.code ? 'w--current' : ''}`}
                                        style={{ background: 'none', border: 'none' }}
                                      >
                                        <div>{locale.name}</div>
                                        <div className="design-system-enterprise-copy--navbar_link-icon"></div>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </nav>
              )}

              {/* Inner Desktop Buttons (Login & Open Account - collapses on scroll) */}
              {isDesktop && (
                <div
                  className="design-system-enterprise-copy--navbar_menu-side-buttons"
                  style={{
                    maxWidth: isScrolled ? '0px' : '300px',
                    opacity: isScrolled ? 0 : 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    pointerEvents: isScrolled ? 'none' : 'auto',
                    transition: 'max-width 0.4s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                  }}
                >
                  <div className="design-system-enterprise-copy--navbar_menu-desktop-buttons">
                    <div className="design-system-enterprise-copy--auth_component">
                      <div className="design-system-enterprise-copy--auth_wrapper">
                        <div className="design-system-enterprise-copy--auth_button_wrapper">
                          <a
                            data-dwp-button="login"
                            data-wf--design-system-enterprise-copy--button-attribute-data-dwp-button--variant="black-border"
                            href="https://home.deriv.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="design-system-enterprise-copy--button w-variant-ace358d6-1840-0bfe-ab5a-550a9f42a890 w-inline-block"
                          >
                            <div data-traking="button-text" className="design-system-enterprise-copy--button_text">
                              Log in
                            </div>
                          </a>
                        </div>
                        <div className="design-system-enterprise-copy--auth_button_wrapper">
                          <a
                            data-wf--design-system-enterprise-copy--button--variant="coral-solid"
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
              )}

              {/* Mobile Right Controls (Login Pill + Burger Toggle) */}
              {!isDesktop && (
                <div className="design-system-enterprise-copy--navbar_mobile-block" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="design-system-enterprise-copy--navbar_mobile-login">
                    <a
                      data-dwp-button="login"
                      href="https://home.deriv.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="design-system-enterprise-copy--button design-system-enterprise-copy--is-black design-system-enterprise-copy--is-border-black design-system-enterprise-copy--navbar_login-button w-inline-block"
                      style={{
                        border: '1px solid #111111',
                        borderRadius: '9999px',
                        padding: '4px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#111111',
                        lineHeight: '20px',
                        display: 'inline-block',
                      }}
                    >
                      <div className="design-system-enterprise-copy--button_text">Log in</div>
                    </a>
                  </div>
                  <button
                    type="button"
                    className={`design-system-enterprise-copy--navbar_burger-button w-nav-button cursor-pointer ${isMobileMenuOpen ? 'w--open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#111',
                    }}
                  >
                    {isMobileMenuOpen ? '✕' : '☰'}
                  </button>
                </div>
              )}

              <div className="design-system-enterprise-copy--navbar_blur-block" />
            </div>

            {/* 3. Right Side Outer Floating Buttons (desktop only, appears when scrolled) */}
            {isDesktop && (
              <div
                className="design-system-enterprise-copy--navbar_right-side-wrapper"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  transform: isScrolled ? 'translateY(0%)' : 'translateY(-135%)',
                  opacity: isScrolled ? 1 : 0,
                  pointerEvents: isScrolled ? 'auto' : 'none',
                  transition: 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                }}
              >
                <div>
                  <div className="design-system-enterprise-copy--auth_component">
                    <div className="design-system-enterprise-copy--auth_wrapper">
                      <div className="design-system-enterprise-copy--auth_button_wrapper">
                        <a
                          data-dwp-button="login"
                          data-wf--design-system-enterprise-copy--button-attribute-data-dwp-button--variant="white-border"
                          href="https://home.deriv.com/dashboard"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="design-system-enterprise-copy--button w-variant-ace358d6-1840-0bfe-ab5a-550a9f42a892 w-inline-block"
                        >
                          <div data-traking="button-text" className="design-system-enterprise-copy--button_text">
                            Log in
                          </div>
                        </a>
                      </div>
                      <div className="design-system-enterprise-copy--auth_button_wrapper">
                        <a
                          data-wf--design-system-enterprise-copy--button--variant="coral-solid"
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
            )}
          </div>
        </section>
      </header>

      {/* Mobile Drawer (Visible on Mobile when hamburger is toggled) */}
      {!isDesktop && isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[68px] z-[4999] bg-[#f8f9fa] flex flex-col justify-between overflow-y-auto px-6 py-6"
          style={{ height: 'calc(100dvh - 68px)' }}
        >
          <div className="flex flex-col gap-2">
            <a
              href="/trading-courses"
              onClick={(e) => handleNavClick(e, '/trading-courses')}
              className={`py-3 px-4 rounded-xl text-[17px] font-semibold transition-colors ${
                isCoursesActive ? 'bg-[#e5e7eb] text-[#111111]' : 'text-[#333333] hover:bg-gray-100'
              }`}
            >
              Courses
            </a>

            <a
              href="/trading-guides"
              onClick={(e) => handleNavClick(e, '/trading-guides')}
              className={`py-3 px-4 rounded-xl text-[17px] font-semibold transition-colors ${
                isGuidesActive ? 'bg-[#e5e7eb] text-[#111111]' : 'text-[#333333] hover:bg-gray-100'
              }`}
            >
              Guides
            </a>

            <a
              href="/trading-ebooks"
              onClick={(e) => handleNavClick(e, '/trading-ebooks')}
              className={`py-3 px-4 rounded-xl text-[17px] font-semibold transition-colors ${
                isEbooksActive ? 'bg-[#e5e7eb] text-[#111111]' : 'text-[#333333] hover:bg-gray-100'
              }`}
            >
              Ebooks
            </a>

            <a
              href="https://deriv.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl text-[17px] font-semibold text-[#333333] hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Deriv Blog</span>
              <span className="text-xs text-gray-400">↗</span>
            </a>

            {/* Language Selection in Drawer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">
                Select Language
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LOCALES.map((locale) => (
                  <button
                    key={locale.code}
                    type="button"
                    onClick={() => setCurrentLang(locale.code)}
                    className={`py-2 px-3 rounded-lg text-sm text-left font-medium transition-colors ${
                      currentLang === locale.code
                        ? 'bg-[#111317] text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {locale.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Bottom Auth CTA Buttons */}
          <div className="pt-6 border-t border-gray-200 flex flex-col gap-3">
            <a
              href="https://home.deriv.com/dashboard/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#ff444f] hover:bg-[#eb3e48] text-white text-center font-bold text-[15px] rounded-full transition-colors shadow-sm"
            >
              Open account
            </a>
            <a
              href="https://home.deriv.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 border border-[#111111] text-[#111111] hover:bg-gray-50 text-center font-bold text-[15px] rounded-full transition-colors"
            >
              Log in
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
