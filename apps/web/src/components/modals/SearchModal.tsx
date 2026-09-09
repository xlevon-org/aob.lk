import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ARTICLES_DATA } from '../../data/articles';
import { COURSES_DATA } from '../../data/courses';
import { VIDEOS_DATA } from '../../data/videos';
import { GLOSSARY_TERMS } from '../../data/glossary';
import { 
  Search, 
  X, 
  BookOpen, 
  GraduationCap, 
  Video, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, navigate } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Search across collections
  const filteredArticles = cleanQuery
    ? ARTICLES_DATA.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.subtitle.toLowerCase().includes(cleanQuery) ||
          a.excerpt.toLowerCase().includes(cleanQuery) ||
          a.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      ).slice(0, 4)
    : [];

  const filteredCourses = cleanQuery
    ? COURSES_DATA.filter(
        (c) =>
          c.title.toLowerCase().includes(cleanQuery) ||
          c.subtitle.toLowerCase().includes(cleanQuery) ||
          c.description.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const filteredVideos = cleanQuery
    ? VIDEOS_DATA.filter(
        (v) =>
          v.title.toLowerCase().includes(cleanQuery) ||
          v.description.toLowerCase().includes(cleanQuery)
      ).slice(0, 2)
    : [];

  const filteredGlossary = cleanQuery
    ? GLOSSARY_TERMS.filter(
        (g) =>
          g.term.toLowerCase().includes(cleanQuery) ||
          g.definition.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const totalResults =
    filteredArticles.length +
    filteredCourses.length +
    filteredVideos.length +
    filteredGlossary.length;

  const handleSelectArticle = (slug: string) => {
    setSearchModalOpen(false);
    navigate(`/articles/${slug}`, { articleSlug: slug });
  };

  const handleSelectCourse = (slug: string) => {
    setSearchModalOpen(false);
    navigate(`/courses/${slug}`, { courseSlug: slug });
  };

  const handleSelectVideo = () => {
    setSearchModalOpen(false);
    navigate('/videos');
  };

  const handleSelectGlossary = () => {
    setSearchModalOpen(false);
    navigate('/glossary');
  };

  const POPULAR_SEARCHES = [
    'Volatility 75',
    'Crash & Boom',
    'Forex Pips',
    'Multipliers',
    'Risk Management',
    'Deriv MT5',
    'Support and Resistance'
  ];

  return (
    <div id="deriv-search-modal" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e6e9ea] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e6e9ea] flex items-center gap-3 bg-white">
          <Search size={22} className="text-[#ff444f] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, trading courses, videos, glossary..."
            className="w-full text-[16px] text-[#111111] placeholder-[#999999] outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#999999] hover:text-[#111111] rounded-full hover:bg-[#f2f3f5]"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="px-2 py-1 text-[12px] font-medium text-[#6e6e6e] hover:text-[#111111] bg-[#f2f3f5] rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Content Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-6">
          {/* Default State: Popular Searches & Categories */}
          {!cleanQuery && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6e6e6e] uppercase tracking-wider">
                <TrendingUp size={15} className="text-[#ff444f]" />
                <span>Popular Trading Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 bg-[#f8f9fa] hover:bg-[#fff1f2] hover:text-[#ff444f] border border-[#e6e9ea] hover:border-[#ff444f]/30 rounded-full text-[13.5px] text-[#333333] transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#f2f3f5]">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6e6e6e] uppercase tracking-wider mb-3">
                  <Sparkles size={15} className="text-[#ff444f]" />
                  <span>Featured Learning Paths</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleSelectCourse('mastering-deriv-synthetic-indices')}
                    className="p-3 bg-[#f8f9fa] hover:bg-[#fff1f2] border border-[#e6e9ea] rounded-xl text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-[#ff444f] uppercase tracking-wider">Synthetics</div>
                    <div className="text-[14px] font-semibold text-[#111111] group-hover:text-[#ff444f] transition-colors mt-0.5">
                      Mastering Deriv Synthetic Indices
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectCourse('introduction-to-forex-trading')}
                    className="p-3 bg-[#f8f9fa] hover:bg-[#fff1f2] border border-[#e6e9ea] rounded-xl text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-[#008832] uppercase tracking-wider">Forex</div>
                    <div className="text-[14px] font-semibold text-[#111111] group-hover:text-[#ff444f] transition-colors mt-0.5">
                      Introduction to Forex Trading
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Search Results */}
          {cleanQuery && totalResults > 0 && (
            <div className="space-y-6">
              {/* Articles Section */}
              {filteredArticles.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#6e6e6e] uppercase tracking-wider">
                    <BookOpen size={14} className="text-[#ff444f]" />
                    <span>Articles & Guides ({filteredArticles.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => handleSelectArticle(art.slug)}
                        className="p-3 bg-[#f8f9fa] hover:bg-[#fff1f2] border border-transparent hover:border-[#ff444f]/30 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-medium text-[#6e6e6e] mb-1">
                          <span className="text-[#ff444f] font-semibold">{art.categoryLabel}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                        <h4 className="text-[14.5px] font-semibold text-[#111111] group-hover:text-[#ff444f] transition-colors">
                          {art.title}
                        </h4>
                        <p className="text-[13px] text-[#6e6e6e] line-clamp-1 mt-0.5">
                          {art.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Section */}
              {filteredCourses.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#6e6e6e] uppercase tracking-wider">
                    <GraduationCap size={14} className="text-[#008832]" />
                    <span>Courses ({filteredCourses.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredCourses.map((crs) => (
                      <div
                        key={crs.id}
                        onClick={() => handleSelectCourse(crs.slug)}
                        className="p-3 bg-[#f8f9fa] hover:bg-[#e8f7ee] border border-transparent hover:border-[#008832]/30 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between text-[11px] font-medium text-[#6e6e6e] mb-1">
                          <span className="text-[#008832] font-semibold">{crs.categoryLabel}</span>
                          <span>{crs.duration} • {crs.totalLessons} Lessons</span>
                        </div>
                        <h4 className="text-[14.5px] font-semibold text-[#111111] group-hover:text-[#008832] transition-colors">
                          {crs.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary Terms Section */}
              {filteredGlossary.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#6e6e6e] uppercase tracking-wider">
                    <HelpCircle size={14} className="text-[#2196f3]" />
                    <span>Trading Glossary Terms ({filteredGlossary.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredGlossary.map((term) => (
                      <div
                        key={term.id}
                        onClick={handleSelectGlossary}
                        className="p-3 bg-[#f8f9fa] hover:bg-[#e3f2fd] border border-transparent hover:border-[#2196f3]/30 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="text-[14px] font-semibold text-[#111111] group-hover:text-[#2196f3] transition-colors">
                          {term.term}
                        </div>
                        <div className="text-[12px] text-[#6e6e6e] line-clamp-2 mt-0.5">
                          {term.definition}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Results Empty State */}
          {cleanQuery && totalResults === 0 && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-[#f2f3f5] rounded-full flex items-center justify-center text-[#6e6e6e]">
                <Search size={26} />
              </div>
              <div className="space-y-1">
                <h4 className="text-[17px] font-semibold text-[#111111]">
                  No matching topics found on Deriv Traders Academy
                </h4>
                <p className="text-[14px] text-[#6e6e6e] max-w-md mx-auto">
                  We couldn't find any resources matching "<span className="text-[#111111] font-medium">{query}</span>". Try one of these popular categories instead:
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Synthetic Indices', 'Forex Basics', 'Volatility 75', 'MT5 Guide', 'Multipliers'].map((fallback) => (
                  <button
                    key={fallback}
                    onClick={() => setQuery(fallback)}
                    className="px-3.5 py-1.5 bg-[#f8f9fa] hover:bg-[#fff1f2] hover:text-[#ff444f] border border-[#e6e9ea] rounded-full text-[13px] font-medium cursor-pointer"
                  >
                    {fallback}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#f8f9fa] border-t border-[#e6e9ea] flex items-center justify-between text-[12px] text-[#6e6e6e]">
          <span>Tip: Press ESC anytime to dismiss</span>
          <button 
            onClick={() => {
              setSearchModalOpen(false);
              navigate('/articles');
            }}
            className="text-[#ff444f] hover:underline font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Browse all articles</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
