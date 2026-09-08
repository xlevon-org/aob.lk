import { Ebook } from '../types';

export const EBOOKS_DATA: Ebook[] = [
  {
    id: 'ebook-1',
    slug: '7-traits-successful-financial-traders',
    title: '7 Traits of Successful Financial Traders',
    subtitle: 'Timeless principles, psychological habits, and risk architectures of consistent market winners.',
    description: 'Written by veteran trader Vince Stanzione, this world-renowned handbook reveals the psychological mindset, position sizing discipline, and emotional endurance necessary to navigate financial markets profitably over decades.',
    category: 'forex',
    categoryLabel: 'Trading Psychology',
    author: 'Vince Stanzione',
    authorRole: 'Self-made Multi-Millionaire Trader & Author',
    pageCount: 64,
    fileSize: '4.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    colorAccent: '#ff444f',
    downloadCount: '68,400+',
    featured: true,
    tableOfContents: [
      'Chapter 1: The Psychology of Losing and Small Losses',
      'Chapter 2: Trend Following: The Easiest Way to Trade',
      'Chapter 3: Cutting Losses Quickly Without Hesitation',
      'Chapter 4: Letting Profits Run and Pyramiding',
      'Chapter 5: Simplicity Over Complexity in Charting',
      'Chapter 6: Money Management and Survival Math',
      'Chapter 7: Emotional Detachment and The Long Game'
    ],
    keyHighlights: [
      'Why keeping losses small is more important than having a high win rate.',
      'How to eliminate emotional attachment to money while in active positions.',
      'Actionable checklist to assess your mental readiness before placing trades.'
    ],
    sampleExcerpt: 'The market does not know you exist. It has no personal vendetta against you. The moment you accept that trading is a game of odds, statistics, and disciplined risk limits rather than an arena for proving you are right, your profitability will transform.'
  },
  {
    id: 'ebook-2',
    slug: 'ultimate-guide-to-synthetic-indices',
    title: 'The Ultimate Guide to Deriv Synthetic Indices',
    subtitle: 'Everything you need to master Volatility, Crash/Boom, Step, and Jump indices 24/7/365.',
    description: 'An authoritative manual explaining the cryptographic foundations, continuous liquidity, and quantitative pricing models of Deriv’s flagship synthetic assets.',
    category: 'synthetic-indices',
    categoryLabel: 'Synthetic Indices',
    author: 'Julian Vance & Deriv Quantitative Team',
    authorRole: 'Quantitative Research Division',
    pageCount: 88,
    fileSize: '6.2 MB',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    colorAccent: '#008832',
    downloadCount: '92,100+',
    featured: true,
    tableOfContents: [
      'Chapter 1: Synthetic Assets: Genesis and Market Mechanics',
      'Chapter 2: Volatility Indices (10, 25, 50, 75, 100)',
      'Chapter 3: Crash and Boom: Exploiting Non-Linear Discontinuities',
      'Chapter 4: Step and Jump Indices: Discrete Price Action',
      'Chapter 5: Technical Analysis Frameworks for Synthetics',
      'Chapter 6: Automated Bot Trading with Deriv Bot (DBot)',
      'Chapter 7: Institutional Money Management Guidelines'
    ],
    keyHighlights: [
      'Deep dive into the audited cryptographic RNG architecture.',
      'Mathematical comparison between traditional forex and synthetic spreads.',
      'Tested trading plans for Volatility 75 (1s) and Crash 1000.'
    ],
    sampleExcerpt: 'Because synthetic indices are immune to geopolitical noise, non-farm payroll surprises, and liquidity freezes, your chart analysis works with mathematical consistency regardless of the time of day or weekend.'
  },
  {
    id: 'ebook-3',
    slug: 'forex-trading-for-beginners-handbook',
    title: 'Forex Trading for Beginners: The Complete Manual',
    subtitle: 'Master currency pairs, economic indicators, leverage, and MT5 order execution.',
    description: 'The definitive handbook for newcomers entering the currency exchange market. Includes detailed diagrams on pips, spreads, margin, central bank policies, and technical chart setups.',
    category: 'forex',
    categoryLabel: 'Forex',
    author: 'Elena Rostova',
    authorRole: 'Chief Currency Strategist',
    pageCount: 76,
    fileSize: '5.1 MB',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    colorAccent: '#2196f3',
    downloadCount: '54,300+',
    featured: false,
    tableOfContents: [
      'Chapter 1: Introduction to Foreign Exchange',
      'Chapter 2: Currency Pairs: Majors, Minors, and Exotics',
      'Chapter 3: Pips, Lots, and Profit Calculations',
      'Chapter 4: Margin, Leverage, and Free Margin Explained',
      'Chapter 5: Fundamental Analysis: Trading the Economic Calendar',
      'Chapter 6: Technical Analysis Basics: Support and Resistance',
      'Chapter 7: Developing Your First Trading Plan'
    ],
    keyHighlights: [
      'Zero jargon, easy-to-follow diagrams and calculation tables.',
      'Comprehensive glossary of forex terminology.',
      'Checklist for evaluating daily economic news releases.'
    ],
    sampleExcerpt: 'Trading without understanding leverage is like driving a race car without brakes. Leverage amplifies your buying power, but disciplined position sizing is what keeps you on the track.'
  },
  {
    id: 'ebook-4',
    slug: 'mastering-multipliers-cfd-risk',
    title: 'Mastering Multipliers & CFD Risk Management',
    subtitle: 'How to amplify profit opportunities while strictly capping downside exposure.',
    description: 'Discover how Deriv Multipliers merge the benefits of leveraged CFD trading with the limited-liability risk boundaries of options contracts.',
    category: 'multipliers',
    categoryLabel: 'Multipliers',
    author: 'Deriv Educational Research',
    authorRole: 'Trading Solutions Group',
    pageCount: 52,
    fileSize: '3.9 MB',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    colorAccent: '#8b5cf6',
    downloadCount: '37,800+',
    featured: false,
    tableOfContents: [
      'Chapter 1: The Evolution of Retail Leverage',
      'Chapter 2: Multipliers vs Traditional CFDs: Direct Comparison',
      'Chapter 3: How Multiplier Factors (x100 to x1000) Work',
      'Chapter 4: Protecting Your Trades with Deal Cancellation',
      'Chapter 5: Automatic Stop-Out and Take-Profit Settings',
      'Chapter 6: Practical Multiplier Trading Case Studies'
    ],
    keyHighlights: [
      'Detailed payoff charts showing profit vs loss curves.',
      'Comparison of capital requirements between Spot, CFDs, and Multipliers.',
      'Step-by-step guide to using Deal Cancellation during high volatility.'
    ],
    sampleExcerpt: 'Multipliers give you the freedom to pursue high percentage returns on small capital outlays without the fear of owing money if an extreme gap or crash occurs.'
  }
];
