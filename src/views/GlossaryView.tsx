import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GLOSSARY_TERMS } from '../data/glossary';
import { GlossaryTerm } from '../types';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  RotateCcw, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const GlossaryView: React.FC = () => {
  const { navigate } = useApp();
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      const matchesLetter = selectedLetter === 'ALL' || item.letter.toUpperCase() === selectedLetter;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() ||
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.example && item.example.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesLetter && matchesCategory && matchesSearch;
    });
  }, [selectedLetter, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'synthetics', label: 'Synthetic Indices' },
    { id: 'forex', label: 'Forex' },
    { id: 'technical', label: 'Technical Analysis' },
    { id: 'risk', label: 'Risk Management' },
    { id: 'orders', label: 'Orders & Leverage' },
  ];

  const handleReset = () => {
    setSelectedLetter('ALL');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div id="glossary-directory-page" className="min-h-screen bg-[#f8f9fa] py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px] text-[#6e6e6e]">
            <button onClick={() => navigate('/')} className="hover:text-[#ff444f] cursor-pointer">Home</button>
            <span>/</span>
            <span className="text-[#111111] font-semibold">Glossary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] font-heading tracking-tight">
            Financial & Trading Glossary (A-Z)
          </h1>
          <p className="text-[16px] text-[#555555] max-w-2xl leading-relaxed">
            Essential definitions, formulas, and market terminology explained plainly to help you understand charts, contracts, and platform parameters.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6e9ea] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e6e6e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search definitions, terms, or calculations..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d6dadb] focus:border-[#ff444f] focus:bg-white rounded-xl text-[14px] outline-none transition-all"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#111111] text-white font-semibold shadow-xs'
                      : 'bg-[#f2f3f5] text-[#555555] hover:bg-[#e6e9ea]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet Bar A-Z */}
          <div className="pt-3 border-t border-[#f2f3f5] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setSelectedLetter('ALL')}
              className={`px-3 py-1 text-[12px] font-bold rounded-md transition-colors cursor-pointer shrink-0 ${
                selectedLetter === 'ALL'
                  ? 'bg-[#ff444f] text-white'
                  : 'text-[#555555] hover:bg-[#f2f3f5]'
              }`}
            >
              ALL
            </button>
            {ALPHABET.map((char) => {
              const count = GLOSSARY_TERMS.filter((t) => t.letter === char).length;
              const hasTerms = count > 0;
              return (
                <button
                  key={char}
                  disabled={!hasTerms}
                  onClick={() => setSelectedLetter(char)}
                  className={`w-7 h-7 flex items-center justify-center text-[12px] font-bold rounded-md transition-colors shrink-0 cursor-pointer ${
                    selectedLetter === char
                      ? 'bg-[#ff444f] text-white shadow-xs'
                      : hasTerms
                      ? 'text-[#111111] hover:bg-[#f2f3f5]'
                      : 'text-[#cccccc] cursor-not-allowed'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between text-[13px] text-[#6e6e6e] px-1">
          <span>
            Showing <strong className="text-[#111111]">{filteredTerms.length}</strong> glossary {filteredTerms.length === 1 ? 'term' : 'terms'}
          </span>
          {(selectedLetter !== 'ALL' || selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={handleReset}
              className="text-[#ff444f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* Glossary Terms Cards Grid */}
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                id={`glossary-item-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-2xl border border-[#e6e9ea] hover:border-[#ff444f]/30 hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#fff1f2] text-[#ff444f] font-mono font-bold text-[14px] flex items-center justify-center">
                        {term.letter}
                      </span>
                      <h3 className="text-[18px] font-bold text-[#111111]">
                        {term.term}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#f2f3f5] text-[#6e6e6e]">
                      {term.category}
                    </span>
                  </div>

                  <p className="text-[14.5px] text-[#444444] leading-relaxed">
                    {term.definition}
                  </p>

                  {/* Optional Example / Formula Box */}
                  {term.example && (
                    <div className="p-3 bg-[#f8f9fa] border border-[#e6e9ea] rounded-xl text-[13px] text-[#333333] space-y-1">
                      <span className="font-bold text-[#111111] text-[11.5px] uppercase tracking-wider block">
                        Application Example:
                      </span>
                      <div className="text-[#555555] italic">
                        "{term.example}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Related Terms Pills */}
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="pt-3 border-t border-[#f2f3f5] flex items-center gap-2 flex-wrap text-[12px]">
                    <span className="text-[#888888]">Related:</span>
                    {term.relatedTerms.map((rel) => (
                      <button
                        key={rel}
                        onClick={() => setSearchQuery(rel)}
                        className="px-2 py-0.5 bg-[#f2f3f5] hover:bg-[#fff1f2] hover:text-[#ff444f] text-[#555555] rounded-md transition-colors cursor-pointer font-medium"
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-[#e6e9ea] text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#f2f3f5] text-[#6e6e6e] rounded-2xl flex items-center justify-center">
              <HelpCircle size={30} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#111111]">
                No glossary terms found
              </h3>
              <p className="text-[14px] text-[#6e6e6e]">
                No definitions matched your current query or letter filter.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-[#ff444f] text-white font-semibold text-[14px] rounded-lg shadow-xs hover:bg-[#eb3e48] transition-colors cursor-pointer"
            >
              Show All Terms
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
