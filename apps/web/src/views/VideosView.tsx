import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VIDEOS_DATA } from '../data/videos';
import { VideoItem } from '../types';
import { 
  Play, 
  Search, 
  Clock, 
  Eye, 
  X, 
  User, 
  CheckCircle2, 
  Share2,
  Sparkles 
} from 'lucide-react';

export const VideosView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const filteredVideos = VIDEOS_DATA.filter((v) => {
    const matchesCategory = activeCategory === 'all' || v.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Masterclasses' },
    { id: 'synthetic-indices', label: 'Synthetic Indices' },
    { id: 'forex', label: 'Forex' },
    { id: 'multipliers', label: 'Multipliers' },
    { id: 'platforms', label: 'Platforms & MT5' },
  ];

  return (
    <div id="videos-directory-page" className="min-h-screen bg-[#f8f9fa] py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px] text-[#6e6e6e]">
            <button onClick={() => navigate('/')} className="hover:text-[#ff444f] cursor-pointer">Home</button>
            <span>/</span>
            <span className="text-[#111111] font-semibold">Videos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] font-heading tracking-tight">
            Video Masterclasses & Platform Walkthroughs
          </h1>
          <p className="text-[16px] text-[#555555] max-w-2xl leading-relaxed">
            Watch real-time platform execution, order placement on Deriv Trader & MT5, dynamic indicator setup, and live risk-management demonstrations.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#e6e9ea] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#ff444f] text-white font-semibold'
                    : 'bg-[#f2f3f5] text-[#444444] hover:bg-[#e6e9ea]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e6e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#f8f9fa] border border-[#d6dadb] focus:border-[#ff444f] rounded-lg text-[13px] outline-none"
            />
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-white rounded-2xl border border-[#e6e9ea] hover:border-[#ff444f]/30 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Screen */}
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#ff444f] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={24} className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 text-white font-mono text-[11.5px] rounded">
                    {video.duration}
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 text-[#111111] text-[11px] font-bold uppercase rounded">
                    {video.categoryLabel}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[12px] text-[#6e6e6e]">
                    <span className="flex items-center gap-1">
                      <User size={13} />
                      <span>{video.speaker}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={13} />
                      <span>{video.views}</span>
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-[#111111] group-hover:text-[#ff444f] transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-[13px] text-[#6e6e6e] line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#f2f3f5] flex items-center justify-between text-[12.5px] font-semibold text-[#ff444f]">
                  <span>Watch Masterclass</span>
                  <Play size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setSelectedVideo(null)}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar */}
            <div className="p-4 border-b border-[#e6e9ea] flex items-center justify-between bg-white">
              <span className="text-[14px] font-bold text-[#111111] truncate max-w-md">
                {selectedVideo.title}
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 text-[#6e6e6e] hover:text-[#111111] hover:bg-[#f2f3f5] rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Simulated Video Canvas */}
            <div className="relative aspect-[16/9] bg-black">
              <img
                src={selectedVideo.thumbnailUrl}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#ff444f] flex items-center justify-center shadow-2xl animate-pulse">
                  <Play size={30} className="ml-1" />
                </div>
                <div className="text-[15px] font-medium">Streaming Deriv Educational Video Feed</div>
                <div className="text-[12px] text-gray-400 font-mono">1080p HD • 60 FPS • {selectedVideo.duration}</div>
              </div>
            </div>

            {/* Video Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-bold text-[#111111]">{selectedVideo.speaker}</div>
                  <div className="text-[12px] text-[#6e6e6e]">{selectedVideo.categoryLabel} • {selectedVideo.views} views</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Video link copied!', 'info');
                  }}
                  className="px-3.5 py-1.5 border border-[#d6dadb] hover:bg-[#f2f3f5] rounded-lg text-[13px] font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>

              <p className="text-[14px] text-[#555555] leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
