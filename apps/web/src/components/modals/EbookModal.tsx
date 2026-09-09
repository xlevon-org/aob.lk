import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Download, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Layers, 
  User, 
  Check,
  Share2
} from 'lucide-react';

export const EbookModal: React.FC = () => {
  const { ebookModalItem, setEbookModalItem, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'details' | 'read'>('details');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!ebookModalItem) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      showToast(`Downloaded "${ebookModalItem.title}" (PDF ${ebookModalItem.fileSize})`, 'success');
    }, 1200);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('E-book link copied to clipboard!', 'info');
  };

  return (
    <div id="deriv-ebook-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setEbookModalItem(null)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e6e9ea] overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#e6e9ea] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fff1f2] text-[#ff444f]">
              {ebookModalItem.categoryLabel}
            </span>
            <span className="text-[12px] text-[#6e6e6e]">{ebookModalItem.pageCount} Pages • {ebookModalItem.fileSize} PDF</span>
          </div>
          <button 
            onClick={() => setEbookModalItem(null)}
            className="p-1.5 text-[#6e6e6e] hover:text-[#111111] hover:bg-[#f2f3f5] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* 3D-styled Book Cover Preview */}
            <div className="relative shrink-0 w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-black/10 bg-gradient-to-br from-neutral-800 to-neutral-900 group">
              <img 
                src={ebookModalItem.coverImage} 
                alt={ebookModalItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff444f]">DERIV ACADEMY</span>
                <span className="text-[12px] font-bold text-white leading-tight line-clamp-2">{ebookModalItem.title}</span>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] font-heading tracking-tight leading-snug">
                {ebookModalItem.title}
              </h3>
              <p className="text-[14px] text-[#555555] leading-relaxed">
                {ebookModalItem.subtitle}
              </p>

              <div className="flex items-center gap-3 pt-1 text-[13px] text-[#6e6e6e]">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-[#ff444f]" />
                  <strong className="text-[#333333]">{ebookModalItem.author}</strong>
                </span>
                <span>•</span>
                <span>{ebookModalItem.downloadCount} downloads</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-2.5">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-5 py-2.5 bg-[#ff444f] hover:bg-[#eb3e48] active:bg-[#d4353e] text-white text-[14px] font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {downloading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : downloaded ? (
                    <>
                      <Check size={16} />
                      <span>Downloaded PDF</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download Free PDF ({ebookModalItem.fileSize})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 border border-[#d6dadb] hover:bg-[#f2f3f5] rounded-lg text-[#555555] transition-colors cursor-pointer"
                  title="Share E-book"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-[#e6e9ea] flex gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-[#ff444f] text-[#ff444f]'
                  : 'border-transparent text-[#6e6e6e] hover:text-[#111111]'
              }`}
            >
              Overview & Syllabus
            </button>
            <button
              onClick={() => setActiveTab('read')}
              className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'read'
                  ? 'border-[#ff444f] text-[#ff444f]'
                  : 'border-transparent text-[#6e6e6e] hover:text-[#111111]'
              }`}
            >
              Sample Excerpt Reader
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'details' ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider">
                  Book Description
                </h4>
                <p className="text-[14px] text-[#555555] leading-relaxed">
                  {ebookModalItem.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2.5">
                <h4 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider">
                  What You'll Learn
                </h4>
                <div className="space-y-2">
                  {ebookModalItem.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[13.5px] text-[#444444]">
                      <CheckCircle2 size={16} className="text-[#008832] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table of Contents */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#111111] uppercase tracking-wider">
                  <Layers size={15} className="text-[#ff444f]" />
                  <span>Table of Contents ({ebookModalItem.tableOfContents.length} Chapters)</span>
                </div>
                <div className="bg-[#f8f9fa] border border-[#e6e9ea] rounded-xl p-3.5 space-y-2">
                  {ebookModalItem.tableOfContents.map((chap, idx) => (
                    <div key={idx} className="text-[13px] text-[#444444] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff444f]" />
                      <span>{chap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Sample Excerpt Reader */
            <div className="space-y-4">
              <div className="p-4 bg-[#fff1f2]/50 border border-[#ff444f]/20 rounded-xl flex items-center justify-between text-[13px]">
                <span className="text-[#ff444f] font-semibold flex items-center gap-1.5">
                  <BookOpen size={16} />
                  <span>Sample Excerpt from Chapter 1</span>
                </span>
                <span className="text-[#6e6e6e]">Free Educational Preview</span>
              </div>

              <div className="prose prose-sm max-w-none text-[#333333] leading-relaxed bg-[#fafafa] p-5 rounded-xl border border-[#e6e9ea] font-sans">
                <p className="italic text-[15px] text-[#444444]">
                  "{ebookModalItem.sampleExcerpt}"
                </p>
                <p className="mt-4 text-[14px]">
                  Professional trading requires moving away from the belief that you must be right on every single setup. When you trade with mathematically sound position sizing, individual wins and losses lose their emotional grip.
                </p>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white font-semibold text-[14px] rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Full {ebookModalItem.pageCount}-Page Guide</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
