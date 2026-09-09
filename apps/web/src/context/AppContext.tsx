import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TopicCategory, ContentType, UserBookmark, UserCourseProgress, Ebook } from '../types';

interface AppContextType {
  currentRoute: string;
  currentArticleSlug: string | null;
  currentCourseSlug: string | null;
  navigate: (path: string, options?: { articleSlug?: string; courseSlug?: string }) => void;
  
  activeTopic: TopicCategory;
  setActiveTopic: (topic: TopicCategory) => void;
  
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  
  demoModalOpen: boolean;
  setDemoModalOpen: (open: boolean) => void;
  
  ebookModalItem: Ebook | null;
  setEbookModalItem: (item: Ebook | null) => void;
  
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  
  // Bookmarks
  bookmarks: UserBookmark[];
  toggleBookmark: (item: { id: string; type: ContentType; title: string; slug: string; category: string }) => void;
  isBookmarked: (id: string) => boolean;
  
  // Course progress
  courseProgress: Record<string, UserCourseProgress>;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  recordQuizScore: (courseId: string, lessonId: string, score: number) => void;
  getCourseProgressPercent: (courseId: string, totalLessons: number) => number;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_BOOKMARKS = 'deriv_academy_bookmarks';
const STORAGE_KEY_PROGRESS = 'deriv_academy_course_progress';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Parse initial route from window.location.pathname
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname || '/';
    return path;
  });
  
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(() => {
    const match = window.location.pathname.match(/\/(?:articles|trading-guides)\/([^/]+)/);
    return match ? match[1] : null;
  });

  const [currentCourseSlug, setCurrentCourseSlug] = useState<string | null>(() => {
    const match = window.location.pathname.match(/\/(?:courses|trading-courses)\/([^/]+)/);
    return match ? match[1] : null;
  });

  const [activeTopic, setActiveTopic] = useState<TopicCategory>('all');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [ebookModalItem, setEbookModalItem] = useState<Ebook | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('English');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Persistent Bookmarks
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Course Progress
  const [courseProgress, setCourseProgress] = useState<Record<string, UserCourseProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentRoute(path);

      const artMatch = path.match(/\/(?:articles|trading-guides)\/([^/]+)/);
      setCurrentArticleSlug(artMatch ? artMatch[1] : null);

      const crsMatch = path.match(/\/(?:courses|trading-courses)\/([^/]+)/);
      setCurrentCourseSlug(crsMatch ? crsMatch[1] : null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { articleSlug?: string; courseSlug?: string }) => {
    setCurrentRoute(path);
    if (options?.articleSlug !== undefined) {
      setCurrentArticleSlug(options.articleSlug);
    } else if (!path.startsWith('/articles/') && !path.startsWith('/trading-guides/')) {
      setCurrentArticleSlug(null);
    } else {
      const match = path.match(/\/(?:articles|trading-guides)\/([^/]+)/);
      if (match) setCurrentArticleSlug(match[1]);
    }

    if (options?.courseSlug !== undefined) {
      setCurrentCourseSlug(options.courseSlug);
    } else if (!path.startsWith('/courses/') && !path.startsWith('/trading-courses/')) {
      setCurrentCourseSlug(null);
    } else {
      const match = path.match(/\/(?:courses|trading-courses)\/([^/]+)/);
      if (match) setCurrentCourseSlug(match[1]);
    }

    try {
      window.history.pushState({}, '', path);
    } catch {
      // In restricted iframe environments fallback gracefully
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const toggleBookmark = (item: { id: string; type: ContentType; title: string; slug: string; category: string }) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      let updated: UserBookmark[];
      if (exists) {
        updated = prev.filter((b) => b.id !== item.id);
        showToast(`Removed "${item.title.substring(0, 32)}..." from saved items`, 'info');
      } else {
        const newBookmark: UserBookmark = {
          ...item,
          savedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
        updated = [newBookmark, ...prev];
        showToast(`Saved "${item.title.substring(0, 32)}..." to your library`, 'success');
      }
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      } catch {
        // LocalStorage fallback
      }
      return updated;
    });
  };

  const isBookmarked = (id: string): boolean => {
    return bookmarks.some((b) => b.id === id);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setCourseProgress((prev) => {
      const current = prev[courseId] || { courseId, completedLessonIds: [], quizScores: {} };
      if (!current.completedLessonIds.includes(lessonId)) {
        const updated = {
          ...prev,
          [courseId]: {
            ...current,
            completedLessonIds: [...current.completedLessonIds, lessonId],
            lastLessonId: lessonId,
          }
        };
        try {
          localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));
        } catch {}
        showToast('Lesson marked as completed!', 'success');
        return updated;
      }
      return prev;
    });
  };

  const recordQuizScore = (courseId: string, lessonId: string, score: number) => {
    setCourseProgress((prev) => {
      const current = prev[courseId] || { courseId, completedLessonIds: [], quizScores: {} };
      const updated = {
        ...prev,
        [courseId]: {
          ...current,
          quizScores: {
            ...current.quizScores,
            [lessonId]: score,
          }
        }
      };
      try {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const getCourseProgressPercent = (courseId: string, totalLessons: number): number => {
    const course = courseProgress[courseId];
    if (!course || totalLessons <= 0) return 0;
    return Math.min(100, Math.round((course.completedLessonIds.length / totalLessons) * 100));
  };

  // Keyboard shortcut Ctrl+K or Cmd+K to trigger global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setDemoModalOpen(false);
        setEbookModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        currentArticleSlug,
        currentCourseSlug,
        navigate,
        activeTopic,
        setActiveTopic,
        searchModalOpen,
        setSearchModalOpen,
        demoModalOpen,
        setDemoModalOpen,
        ebookModalItem,
        setEbookModalItem,
        activeLanguage,
        setActiveLanguage,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        courseProgress,
        markLessonComplete,
        recordQuizScore,
        getCourseProgressPercent,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
