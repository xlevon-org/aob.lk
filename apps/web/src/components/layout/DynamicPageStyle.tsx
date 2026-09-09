import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const DynamicPageStyle: React.FC = () => {
  const { currentRoute } = useApp();

  useEffect(() => {
    let targetCss = '/css/home.css';

    if (currentRoute === '/' || currentRoute === '') {
      targetCss = '/css/home.css';
    } else if (currentRoute === '/trading-guides' || currentRoute === '/articles') {
      targetCss = '/css/guides.css';
    } else if (
      currentRoute.startsWith('/trading-guides/') ||
      currentRoute.startsWith('/articles/')
    ) {
      targetCss = '/css/guide-detail.css';
    } else if (currentRoute === '/trading-courses' || currentRoute === '/courses') {
      targetCss = '/css/courses.css';
    } else if (
      currentRoute.includes('/lessons/') ||
      currentRoute.startsWith('/trading-lessons/')
    ) {
      targetCss = '/css/lesson.css';
    } else if (
      currentRoute.startsWith('/trading-courses/') ||
      currentRoute.startsWith('/courses/')
    ) {
      targetCss = '/css/course-detail.css';
    } else if (currentRoute === '/trading-ebooks' || currentRoute === '/ebooks') {
      targetCss = '/css/ebooks.css';
    } else if (
      currentRoute === '/videos' ||
      currentRoute === '/glossary' ||
      currentRoute === '/bookmarks'
    ) {
      targetCss = '/css/guides.css';
    }

    let linkEl = document.getElementById('deriv-page-style') as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = 'deriv-page-style';
      linkEl.rel = 'stylesheet';
      linkEl.type = 'text/css';
      document.head.appendChild(linkEl);
    }

    if (linkEl.getAttribute('href') !== targetCss) {
      linkEl.setAttribute('href', targetCss);
    }
  }, [currentRoute]);

  return null;
};
