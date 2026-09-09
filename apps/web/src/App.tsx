import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/modals/SearchModal';
import { DemoAccountModal } from './components/modals/DemoAccountModal';
import { EbookModal } from './components/modals/EbookModal';
import { AuthModal } from './components/modals/AuthModal';
import { AccountSettingsModal } from './components/modals/AccountSettingsModal';
import { CashierModal } from './components/modals/CashierModal';
import { Toast } from './components/common/Toast';
import { DynamicPageStyle } from './components/layout/DynamicPageStyle';

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
    <div className="antialiased selection:bg-[#ff444f] selection:text-white">
      {/* Dynamic Deriv Page Stylesheet matching active route */}
      <DynamicPageStyle />

      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="local-site-wrap">
          {/* Global Header */}
          <Header />

          {/* Main Dynamic View Content */}
          {renderView()}

          {/* Global Footer */}
          <Footer />
        </div>
      </div>

      {/* Global Dialog Modals & Toasts */}
      <SearchModal />
      <DemoAccountModal />
      <EbookModal />
      <AuthModal />
      <AccountSettingsModal />
      <CashierModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

