import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/modals/SearchModal';
import { DemoAccountModal } from './components/modals/DemoAccountModal';
import { EbookModal } from './components/modals/EbookModal';
import { Toast } from './components/common/Toast';

import { HomeView } from './views/HomeView';
import { ArticlesView } from './views/ArticlesView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { CoursesView } from './views/CoursesView';
import { CoursePlayerView } from './views/CoursePlayerView';
import { VideosView } from './views/VideosView';
import { EbooksView } from './views/EbooksView';
import { GlossaryView } from './views/GlossaryView';
import { BookmarksView } from './views/BookmarksView';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render view based on active route
  const renderView = () => {
    if (currentRoute === '/') {
      return <HomeView />;
    }
    if (currentRoute === '/articles' || currentRoute === '/trading-guides') {
      return <ArticlesView />;
    }
    if (currentRoute.startsWith('/articles/') || currentRoute.startsWith('/trading-guides/')) {
      return <ArticleDetailView />;
    }
    if (currentRoute === '/courses' || currentRoute === '/trading-courses') {
      return <CoursesView />;
    }
    if (currentRoute.startsWith('/courses/') || currentRoute.startsWith('/trading-courses/')) {
      return <CoursePlayerView />;
    }
    if (currentRoute === '/videos') {
      return <VideosView />;
    }
    if (currentRoute === '/ebooks' || currentRoute === '/trading-ebooks') {
      return <EbooksView />;
    }
    if (currentRoute === '/glossary') {
      return <GlossaryView />;
    }
    if (currentRoute === '/bookmarks') {
      return <BookmarksView />;
    }

    return <HomeView />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#ff444f] selection:text-white">
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="local-site-wrap">
          {/* Global Header */}
          <Header />

          {/* Main Dynamic View Content */}
          <div className="content-wrap">
            {renderView()}
          </div>

          {/* Global Footer */}
          <Footer />
        </div>
      </div>

      {/* Global Dialog Modals & Toasts */}
      <SearchModal />
      <DemoAccountModal />
      <EbookModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
