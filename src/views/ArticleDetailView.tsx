import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ARTICLES_DATA } from '../data/articles';
import { TradingChartPreview } from '../components/common/TradingChartPreview';
import { 
  ArrowLeft, 
  Bookmark, 
  Clock, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface ArticleDetailViewProps {
  slug?: string;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ slug }) => {
  const { 
    currentParams, 
    navigate, 
    toggleBookmark, 
    isBookmarked, 
    showToast,
    setDemoModalOpen 
  } = useApp();

  const activeSlug = slug || currentParams.articleSlug || 'mastering-volatility-indices-deriv-synthetics';
  const article = ARTICLES_DATA.find((a) => a.slug === activeSlug) || ARTICLES_DATA[0];

  const [activeSection, setActiveSection] = useState<string>('intro');

  // Find related articles in the same or adjacent category
  const relatedArticles = ARTICLES_DATA.filter(
    (a) => a.id !== article.id && (a.category === article.category || a.difficulty === article.difficulty)
  ).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Article link copied to clipboard!', 'info');
  };

  return (
    <div id="article-detail-page" className="min-h-screen bg-white">
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="bg-[#f8f9fa] border-b border-[#e6e9ea] py-3">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/trading-guides')}
            className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#555555] hover:text-[#ff444f] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to All Guides</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                toggleBookmark({
                  id: article.id,
                  type: 'article',
                  title: article.title,
                  slug: article.slug,
                  category: article.categoryLabel,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                isBookmarked(article.id)
                  ? 'bg-[#fff1f2] text-[#ff444f] font-semibold'
                  : 'bg-white border border-[#d6dadb] text-[#333333] hover:bg-[#f2f3f5]'
              }`}
            >
              <Bookmark size={15} className={isBookmarked(article.id) ? 'fill-[#ff444f]' : ''} />
              <span>{isBookmarked(article.id) ? 'Saved' : 'Save Guide'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 bg-white border border-[#d6dadb] hover:bg-[#f2f3f5] rounded-lg text-[#555555] transition-colors cursor-pointer"
              title="Share article"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Article Header */}
      <header className="pt-10 pb-8 bg-white border-b border-[#e6e9ea]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-[#fff1f2] text-[#ff444f] text-[12px] font-bold uppercase tracking-wider rounded-md">
              {article.categoryLabel}
            </span>
            <span className="text-[13px] text-[#888888]">•</span>
            <span className="text-[13px] text-[#6e6e6e] flex items-center gap-1">
              <Clock size={14} />
              <span>{article.readTime}</span>
            </span>
            <span className="text-[13px] text-[#888888]">•</span>
            <span className="text-[12px] px-2 py-0.5 rounded font-semibold uppercase bg-[#e8f7ee] text-[#008832]">
              {article.difficulty}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111111] font-heading tracking-tight leading-[1.18]">
            {article.title}
          </h1>

          <p className="text-[18px] text-[#555555] leading-relaxed">
            {article.subtitle}
          </p>

          {/* Author Byline */}
          <div className="pt-4 border-t border-[#f2f3f5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border border-[#e6e9ea]"
              />
              <div>
                <div className="text-[14.5px] font-bold text-[#111111]">{article.author.name}</div>
                <div className="text-[12px] text-[#6e6e6e]">{article.author.role} • Updated {article.publishedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Content Container & Sticky Sidebar */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Body (8 cols) */}
          <main className="lg:col-span-8 space-y-8 text-[#222222] text-[16px] leading-[1.75]">
            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#e6e9ea] aspect-[16/9]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Key Takeaways Callout Card */}
            <div className="bg-[#f8f9fa] border-l-4 border-[#ff444f] rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-wider text-[#ff444f]">
                <Sparkles size={16} />
                <span>Key Learning Takeaways</span>
              </div>
              <ul className="space-y-2 text-[15px] text-[#333333]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[#008832] shrink-0 mt-1" />
                  <span>Understand the cryptographic RNG mechanics behind continuous 24/7 synthetic indices.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[#008832] shrink-0 mt-1" />
                  <span>Identify market phases: consolidation ranges versus high-momentum trend expansions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[#008832] shrink-0 mt-1" />
                  <span>Enforce a strict 1-2% maximum account drawdown rule per position to eliminate catastrophic liquidation.</span>
                </li>
              </ul>
            </div>

            {/* In-depth Article Content Sections */}
            <section id="section-intro" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#111111] font-heading pt-4">
                1. Understanding the Core Market Structure
              </h2>
              <p>
                In retail financial trading, the greatest obstacle to disciplined execution is not predicting future price with 100% accuracy, but properly managing downside volatility. Unlike traditional currency pairs that close on Friday evening and open Sunday afternoon with weekend price gaps, Deriv's synthetic indices run uninterrupted 365 days a year.
              </p>
              <p>
                Because these price feeds are derived from cryptographically audited pseudorandom number generators (PRNGs), they mimic real-world financial market volatility without being skewed by central bank interest rate decisions, non-farm payroll reports, or unexpected geopolitical news headlines.
              </p>
            </section>

            {/* Embedded Interactive Chart Component */}
            <div className="my-6">
              <TradingChartPreview
                symbol={article.category === 'synthetic-indices' ? 'Volatility 75 (1s) Index' : 'EUR/USD Spot Pair'}
                title="Dynamic Moving Average & Support Zone Setup"
                description="Notice the retest of the dynamic 20 EMA after the initial momentum expansion."
              />
            </div>

            <section id="section-strategy" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#111111] font-heading pt-4">
                2. Formulating High-Probability Entry Criteria
              </h2>
              <p>
                A reliable technical trading system consists of three non-negotiable elements:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-[#111111]">Higher-Timeframe Direction:</strong> Always align your setup with the 1-hour or 4-hour trend structure before dropping to the 5-minute or 15-minute timeframe for precision execution.
                </li>
                <li>
                  <strong className="text-[#111111]">Value Area Confirmation:</strong> Avoid entering when price is overextended far above the 20 Exponential Moving Average (EMA). Patient traders wait for pullbacks into dynamic support.
                </li>
                <li>
                  <strong className="text-[#111111]">Trigger Candlestick:</strong> Look for decisive pin bars, engulfing candles, or volume spikes that demonstrate buyers or sellers actively defending the zone.
                </li>
              </ol>
            </section>

            {/* Risk Box Callout */}
            <div className="bg-[#fff1f2] border border-[#ff444f]/30 rounded-xl p-5 flex items-start gap-4 text-[14.5px]">
              <AlertTriangle size={22} className="text-[#ff444f] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#111111] block">Crucial Risk Management Directive</span>
                <p className="text-[#555555]">
                  Never risk more than 1% to 2% of your total account equity on any individual trade. Even an exceptional 65% win-rate system will experience streaks of 4-5 consecutive losses over a 100-trade sample size.
                </p>
              </div>
            </div>

            <section id="section-execution" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#111111] font-heading pt-4">
                3. Position Sizing and Execution Rules
              </h2>
              <p>
                Calculate your lot size based on the exact distance to your Stop Loss rather than an arbitrary lot volume. If your stop distance is 50 pips or 250 points, adjust your volume so that hitting the stop loss equals your predefined risk threshold.
              </p>
              <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e6e9ea] font-mono text-[13.5px] text-[#333333]">
                <div>Lot Size Calculation Formula:</div>
                <div className="text-[#ff444f] font-bold mt-1">
                  Position Size = (Account Balance × Risk %) ÷ (Stop Loss Points × Point Value)
                </div>
              </div>
            </section>

            {/* Article Author Bio Box */}
            <div className="mt-12 p-6 bg-[#f8f9fa] rounded-2xl border border-[#e6e9ea] flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-[17px] font-bold text-[#111111]">{article.author.name}</h4>
                  <span className="text-[11px] font-semibold text-[#008832] bg-[#e8f7ee] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck size={12} />
                    <span>Verified Deriv Analyst</span>
                  </span>
                </div>
                <p className="text-[13.5px] text-[#6e6e6e] leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>

            {/* Demo Account Sandbox Prompt */}
            <div className="mt-8 bg-gradient-to-r from-[#171a22] to-[#1d212b] rounded-2xl p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-bold font-heading">
                  Practice this strategy on Deriv Trader
                </h3>
                <p className="text-[14px] text-[#8e95a5]">
                  Open a free demo account with $10,000 in replenishable virtual funds.
                </p>
              </div>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-6 py-3 bg-[#ff444f] hover:bg-[#eb3e48] text-white font-semibold text-[14px] rounded-lg transition-colors shadow-md whitespace-nowrap cursor-pointer"
              >
                Open Demo Account
              </button>
            </div>
          </main>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Table of Contents Box */}
            <div className="sticky top-24 bg-[#f8f9fa] border border-[#e6e9ea] rounded-2xl p-6 space-y-4">
              <h4 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider">
                Table of Contents
              </h4>
              <nav className="space-y-2 text-[14px]">
                <a
                  href="#section-intro"
                  className="block py-1.5 px-3 rounded-lg text-[#555555] hover:text-[#ff444f] hover:bg-white transition-colors"
                >
                  1. Market Structure & Synthetics
                </a>
                <a
                  href="#interactive-trading-chart"
                  className="block py-1.5 px-3 rounded-lg text-[#555555] hover:text-[#ff444f] hover:bg-white transition-colors"
                >
                  Interactive Candlestick Chart
                </a>
                <a
                  href="#section-strategy"
                  className="block py-1.5 px-3 rounded-lg text-[#555555] hover:text-[#ff444f] hover:bg-white transition-colors"
                >
                  2. Entry Criteria & Triggers
                </a>
                <a
                  href="#section-execution"
                  className="block py-1.5 px-3 rounded-lg text-[#555555] hover:text-[#ff444f] hover:bg-white transition-colors"
                >
                  3. Position Sizing Formula
                </a>
              </nav>

              <div className="pt-4 border-t border-[#e6e9ea]">
                <div className="text-[12px] font-semibold text-[#6e6e6e] uppercase tracking-wider mb-2">
                  Tags & Topics
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white text-[#444444] text-[12px] rounded-md border border-[#e6e9ea]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Articles Card List */}
            <div className="space-y-4">
              <h4 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider">
                Related Guides
              </h4>
              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/trading-guides/${rel.slug}`, { articleSlug: rel.slug })}
                    className="p-4 bg-white hover:bg-[#f8f9fa] border border-[#e6e9ea] hover:border-[#ff444f]/30 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#6e6e6e] mb-1">
                      <span className="text-[#ff444f] font-semibold">{rel.categoryLabel}</span>
                      <span>•</span>
                      <span>{rel.readTime}</span>
                    </div>
                    <h5 className="text-[14px] font-bold text-[#111111] group-hover:text-[#ff444f] transition-colors line-clamp-2">
                      {rel.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
