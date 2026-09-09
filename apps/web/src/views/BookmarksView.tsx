import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  FileText,
  RotateCcw
} from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { bookmarks, toggleBookmark, navigate, showToast } = useApp();

  const handleOpenItem = (item: any) => {
    if (item.type === 'article') {
      navigate(`/articles/${item.slug}`, { articleSlug: item.slug });
    } else if (item.type === 'course') {
      navigate(`/courses/${item.slug}`, { courseSlug: item.slug });
    } else if (item.type === 'ebook') {
      navigate('/ebooks');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen size={16} className="text-[#ff444f]" />;
      case 'course': return <GraduationCap size={16} className="text-[#008832]" />;
      default: return <FileText size={16} className="text-[#2196f3]" />;
    }
  };

  return (
    <div id="bookmarks-page" className="min-h-screen bg-[#f8f9fa] py-10 sm:py-14">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px] text-[#6e6e6e]">
            <button onClick={() => navigate('/')} className="hover:text-[#ff444f] cursor-pointer">Home</button>
            <span>/</span>
            <span className="text-[#111111] font-semibold">Saved Library</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111111] font-heading tracking-tight">
                Your Saved Library
              </h1>
              <p className="text-[15px] text-[#555555] mt-1">
                Articles, courses, and trading frameworks saved for offline review.
              </p>
            </div>
            <span className="px-3 py-1 bg-white border border-[#d6dadb] text-[#111111] text-[13px] font-bold rounded-full">
              {bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 ? (
          <div className="space-y-3">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white rounded-xl p-5 border border-[#e6e9ea] hover:shadow-md transition-all flex items-center justify-between gap-4 group"
              >
                <div 
                  onClick={() => handleOpenItem(bm)}
                  className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#e6e9ea] flex items-center justify-center shrink-0">
                    {getTypeIcon(bm.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 text-[11.5px]">
                      <span className="font-bold uppercase tracking-wider text-[#ff444f]">
                        {bm.category}
                      </span>
                      <span className="text-[#888888]">•</span>
                      <span className="text-[#6e6e6e] capitalize">{bm.type}</span>
                    </div>
                    <h3 className="text-[16px] font-bold text-[#111111] group-hover:text-[#ff444f] transition-colors truncate">
                      {bm.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenItem(bm)}
                    className="px-3.5 py-1.5 bg-[#f2f3f5] hover:bg-[#ff444f] hover:text-white rounded-lg text-[13px] font-semibold text-[#333333] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => {
                      toggleBookmark(bm);
                      showToast('Item removed from saved library', 'info');
                    }}
                    className="p-2 text-[#999999] hover:text-[#ff444f] hover:bg-[#fff1f2] rounded-lg transition-colors cursor-pointer"
                    title="Remove from bookmarks"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-[#e6e9ea] text-center space-y-5">
            <div className="w-16 h-16 mx-auto bg-[#fff1f2] text-[#ff444f] rounded-2xl flex items-center justify-center">
              <Bookmark size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#111111]">
                Your library is currently empty
              </h3>
              <p className="text-[14.5px] text-[#6e6e6e] max-w-md mx-auto">
                Bookmark guides, courses, or e-books as you explore to build your personalized trading syllabus.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/articles')}
                className="px-5 py-2.5 bg-[#ff444f] hover:bg-[#eb3e48] text-white font-semibold text-[14px] rounded-xl transition-colors cursor-pointer"
              >
                Browse Articles
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-5 py-2.5 bg-white border border-[#d6dadb] hover:bg-[#f8f9fa] text-[#111111] font-semibold text-[14px] rounded-xl transition-colors cursor-pointer"
              >
                Explore Courses
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
