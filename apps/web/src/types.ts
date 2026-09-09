export type TopicCategory = 
  | 'all'
  | 'forex'
  | 'synthetic-indices'
  | 'stocks-indices'
  | 'commodities'
  | 'cryptocurrencies'
  | 'options'
  | 'multipliers';

export type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

export type ContentType = 'article' | 'course' | 'video' | 'ebook';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: TopicCategory;
  categoryLabel: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  author: Author;
  featured?: boolean;
  tableOfContents: { id: string; title: string; level?: number }[];
  content: {
    intro: string;
    sections: {
      id: string;
      heading: string;
      paragraphs: string[];
      callout?: {
        type: 'tip' | 'warning' | 'takeaway';
        title: string;
        text: string;
      };
      chartData?: {
        symbol: string;
        title: string;
        trend: 'up' | 'down' | 'volatile';
        description: string;
      };
      keyPoints?: string[];
    }[];
    conclusion: string;
  };
  tags: string[];
  relatedArticleIds: string[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoDurationSeconds: number;
  completed?: boolean;
  description: string;
  videoSummary: string;
  keyTakeaways: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: TopicCategory;
  categoryLabel: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  totalLessons: number;
  rating: number;
  reviewCount: number;
  studentsCount: number;
  imageUrl: string;
  author: Author;
  featured?: boolean;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TopicCategory;
  categoryLabel: string;
  duration: string;
  durationSeconds: number;
  publishedDate: string;
  views: string;
  thumbnailUrl: string;
  speaker: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chapters: { time: string; title: string }[];
  relatedGuideSlug?: string;
}

export interface Ebook {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: TopicCategory;
  categoryLabel: string;
  author: string;
  authorRole: string;
  pageCount: number;
  fileSize: string;
  coverImage: string;
  colorAccent: string;
  downloadCount: string;
  featured?: boolean;
  tableOfContents: string[];
  keyHighlights: string[];
  sampleExcerpt: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  letter: string;
  category: TopicCategory;
  categoryLabel: string;
  definition: string;
  example: string;
  formula?: string;
  relatedTerms: string[];
  relatedArticleSlug?: string;
}

export interface UserBookmark {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  category: string;
  savedAt: string;
}

export interface UserCourseProgress {
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  quizScores: Record<string, number>;
}

export type AuthModalView = 
  | 'login' 
  | 'signup' 
  | 'forgot-password' 
  | 'otp-verification' 
  | 'reset-password' 
  | 'reset-success';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  accountId: string; // e.g., 'CR8941253' or 'VRTC4821098'
  demoAccountId: string;
  realAccountId: string;
  accountType: 'demo' | 'real';
  demoBalance: number;
  realBalance: number;
  currency: string;
  isVerified: boolean;
  phone: string;
  country: string;
  address: string;
  avatarUrl?: string;
  createdAt: string;
}

