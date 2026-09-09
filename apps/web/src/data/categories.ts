import { TopicCategory } from '../types';

export interface CategoryInfo {
  id: TopicCategory;
  name: string;
  description: string;
  count: number;
}

export const TOPIC_CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Topics',
    description: 'Browse all educational resources across financial instruments',
    count: 36,
  },
  {
    id: 'forex',
    name: 'Forex',
    description: 'Learn the fundamentals of currency pairs, exchange rates, and macro trading strategies',
    count: 12,
  },
  {
    id: 'synthetic-indices',
    name: 'Synthetic Indices',
    description: 'Master Deriv proprietary synthetics including Volatility, Crash/Boom, and Step indices available 24/7',
    count: 8,
  },
  {
    id: 'stocks-indices',
    name: 'Stocks & Indices',
    description: 'Trade major world equities, corporate earnings, tech stocks, and global market indices',
    count: 6,
  },
  {
    id: 'commodities',
    name: 'Commodities',
    description: 'Understand supply-demand cycles for Gold, Silver, Crude Oil, and Natural Gas',
    count: 4,
  },
  {
    id: 'cryptocurrencies',
    name: 'Cryptocurrencies',
    description: 'Explore Bitcoin, Ethereum, and digital asset market dynamics without owning the underlying crypto',
    count: 5,
  },
  {
    id: 'options',
    name: 'Options & Digits',
    description: 'Discover digital options, Higher/Lower, Touch/No-Touch, and Matches/Differs contracts',
    count: 4,
  },
  {
    id: 'multipliers',
    name: 'Multipliers',
    description: 'Amplify market exposure with capped downside risk and automatic stop-out protections',
    count: 5,
  },
];
