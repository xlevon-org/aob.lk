import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'term-ask',
    term: 'Ask Price',
    letter: 'A',
    category: 'forex',
    categoryLabel: 'Forex & Markets',
    definition: 'The lowest price a seller or broker is willing to accept for a financial asset. Also referred to as the offer price. When you open a BUY position, you execute at the Ask price.',
    example: 'If EUR/USD is quoted as 1.0850 / 1.0852, 1.0852 is the Ask price you pay to enter a long position.',
    relatedTerms: ['Bid Price', 'Spread', 'Market Order'],
    relatedArticleSlug: 'forex-market-hours-session-overlaps'
  },
  {
    id: 'term-accumulators',
    term: 'Accumulator Options',
    letter: 'A',
    category: 'options',
    categoryLabel: 'Options',
    definition: 'A proprietary Deriv options contract where your payout grows continuously at a fixed rate (e.g. 1% to 5%) every tick that the underlying asset stays within a predetermined price barrier.',
    example: 'With a 3% growth rate per tick, staying within the barrier for 10 ticks multiplies your initial stake exponentially.',
    relatedTerms: ['Digital Options', 'Multipliers', 'Ticks'],
    relatedArticleSlug: 'understanding-deriv-multipliers'
  },
  {
    id: 'term-arbitrage',
    term: 'Arbitrage',
    letter: 'A',
    category: 'forex',
    categoryLabel: 'Trading Strategies',
    definition: 'The simultaneous purchase and sale of an asset in different markets to exploit minor pricing discrepancies and lock in a risk-free profit.',
    example: 'Buying Bitcoin on Exchange A for $60,000 and instantly selling it on Exchange B for $60,150.',
    relatedTerms: ['Liquidity', 'Slippage', 'Execution Speed']
  },
  {
    id: 'term-bear-market',
    term: 'Bear Market',
    letter: 'B',
    category: 'stocks-indices',
    categoryLabel: 'Market Sentiment',
    definition: 'A market condition where asset prices drop steadily over a sustained period, typically characterized by widespread investor pessimism and downward trend structure.',
    example: 'A 20% or greater decline from recent peak highs in equity indices like the S&P 500 or NASDAQ.',
    relatedTerms: ['Bull Market', 'Short Selling', 'Correction']
  },
  {
    id: 'term-bid',
    term: 'Bid Price',
    letter: 'B',
    category: 'forex',
    categoryLabel: 'Forex & Markets',
    definition: 'The highest price that a buyer or market maker is willing to pay to purchase a financial instrument. When you enter a SELL position, you execute at the Bid price.',
    example: 'If GBP/USD is 1.2740 / 1.2742, 1.2740 is the Bid price.',
    relatedTerms: ['Ask Price', 'Spread', 'Liquidity Provider']
  },
  {
    id: 'term-boom-index',
    term: 'Boom Indices',
    letter: 'B',
    category: 'synthetic-indices',
    categoryLabel: 'Synthetic Indices',
    definition: 'Proprietary Deriv synthetic markets that simulate steady downward tick drift interspersed with sudden, large upward price spikes occurring on average once every 500 or 1000 ticks.',
    example: 'Boom 1000 drops in 1-tick increments, followed by a dramatic 30-point vertical rally when a spike triggers.',
    relatedTerms: ['Crash Indices', 'Volatility Indices', 'Spike Trading'],
    relatedArticleSlug: 'crash-boom-indices-mechanics'
  },
  {
    id: 'term-cfd',
    term: 'CFD (Contract for Difference)',
    letter: 'C',
    category: 'forex',
    categoryLabel: 'Derivatives',
    definition: 'A financial derivative contract where the difference between the opening and closing trade price is settled in cash without physical ownership of the underlying instrument.',
    example: 'Trading gold CFDs enables you to profit from price fluctuations without storing physical gold bullion.',
    relatedTerms: ['Leverage', 'Margin', 'Short Selling'],
    relatedArticleSlug: 'crypto-cfds-vs-spot-trading'
  },
  {
    id: 'term-crash-index',
    term: 'Crash Indices',
    letter: 'C',
    category: 'synthetic-indices',
    categoryLabel: 'Synthetic Indices',
    definition: 'Proprietary Deriv synthetic markets featuring steady upward movements interspersed with periodic, sudden downward crashes occurring on average once every 500 or 1000 ticks.',
    example: 'Crash 500 simulates one downward drop every 500 ticks on average.',
    relatedTerms: ['Boom Indices', 'Volatility Indices', 'Spike'],
    relatedArticleSlug: 'crash-boom-indices-mechanics'
  },
  {
    id: 'term-deal-cancellation',
    term: 'Deal Cancellation',
    letter: 'D',
    category: 'multipliers',
    categoryLabel: 'Multipliers',
    definition: 'A unique risk mitigation feature on Deriv Multipliers that allows a trader to cancel an active trade within a selected timeframe (e.g., 5 to 60 minutes) to reclaim the full initial stake if the trade moves unfavorably.',
    example: 'If an unexpected news spike moves against your Multiplier trade within 10 minutes, you can click Cancel and recover 100% of your stake.',
    relatedTerms: ['Multipliers', 'Stop Loss', 'Take Profit'],
    relatedArticleSlug: 'understanding-deriv-multipliers'
  },
  {
    id: 'term-drawdown',
    term: 'Drawdown',
    letter: 'D',
    category: 'forex',
    categoryLabel: 'Risk Management',
    definition: 'The measure of decline from a historical account equity peak to a subsequent trough, expressed in currency or percentage.',
    formula: 'Drawdown % = ((Peak Equity - Trough Equity) / Peak Equity) * 100',
    example: 'If your trading account drops from $10,000 to $8,500, your maximum drawdown is 15%.',
    relatedTerms: ['Risk Management', 'Capital Preservation'],
    relatedArticleSlug: 'risk-management-rules-for-traders'
  },
  {
    id: 'term-ema',
    term: 'EMA (Exponential Moving Average)',
    letter: 'E',
    category: 'synthetic-indices',
    categoryLabel: 'Technical Analysis',
    definition: 'A technical indicator that calculates the average price of an asset over a set period, placing greater weight and significance on the most recent price data points.',
    example: 'The 20 EMA is widely used to identify short-term pullbacks in trending markets on Volatility 75.',
    relatedTerms: ['SMA', 'Trend Following', 'Support and Resistance'],
    relatedArticleSlug: 'mastering-volatility-indices-deriv'
  },
  {
    id: 'term-fibonacci',
    term: 'Fibonacci Retracement',
    letter: 'F',
    category: 'forex',
    categoryLabel: 'Technical Analysis',
    definition: 'A charting tool using horizontal lines based on key Fibonacci mathematical ratios (23.6%, 38.2%, 50%, 61.8%) to identify potential support or resistance levels during price corrections.',
    example: 'EUR/USD rallies from 1.0500 to 1.0700 and pulls back to the 61.8% retracement level at 1.0576 before resuming its uptrend.',
    relatedTerms: ['Technical Analysis', 'Support and Resistance', 'Pullback']
  },
  {
    id: 'term-leverage',
    term: 'Leverage',
    letter: 'L',
    category: 'forex',
    categoryLabel: 'Margin & Leverage',
    definition: 'The use of borrowed capital provided by a broker to increase the potential return (and risk) of an investment. Allows traders to open positions significantly larger than their cash balance.',
    example: '1:100 leverage allows you to control a $100,000 position with only $1,000 in account margin.',
    relatedTerms: ['Margin', 'Stop Out', 'CFD'],
    relatedArticleSlug: 'risk-management-rules-for-traders'
  },
  {
    id: 'term-margin',
    term: 'Margin',
    letter: 'M',
    category: 'forex',
    categoryLabel: 'Margin & Leverage',
    definition: 'The collateral amount required in your account to open and maintain a leveraged trading position.',
    example: 'If margin requirement is 1%, you must maintain $500 to hold a $50,000 trade.',
    relatedTerms: ['Free Margin', 'Margin Call', 'Leverage']
  },
  {
    id: 'term-multipliers',
    term: 'Multipliers',
    letter: 'M',
    category: 'multipliers',
    categoryLabel: 'Multipliers',
    definition: 'Deriv’s hybrid trading contract that combines the leverage upside of CFDs with strictly limited downside risk. Loss is capped at your stake, with optional Deal Cancellation protection.',
    example: 'A $50 stake with x100 Multiplier turns a 2% favorable move into a $100 profit (200% return).',
    relatedTerms: ['Deal Cancellation', 'Options', 'CFDs'],
    relatedArticleSlug: 'understanding-deriv-multipliers'
  },
  {
    id: 'term-pip',
    term: 'Pip (Percentage in Point)',
    letter: 'P',
    category: 'forex',
    categoryLabel: 'Forex Basics',
    definition: 'The standardized smallest unit of price change in currency pairs, typically representing 0.0001 (or the fourth decimal place) for non-JPY pairs.',
    example: 'If EUR/USD moves from 1.0820 to 1.0825, it has gained 5 pips.',
    relatedTerms: ['Pipette', 'Spread', 'Lot Size'],
    relatedArticleSlug: 'forex-market-hours-session-overlaps'
  },
  {
    id: 'term-risk-reward',
    term: 'Risk-to-Reward Ratio',
    letter: 'R',
    category: 'forex',
    categoryLabel: 'Risk Management',
    definition: 'A calculation comparing the expected return of an investment to the amount of capital risked. Expressed as a ratio such as 1:2 or 1:3.',
    example: 'If your stop loss risks $100 and your take profit targets $300, your risk-to-reward ratio is 1:3.',
    relatedTerms: ['Stop Loss', 'Take Profit', 'Drawdown'],
    relatedArticleSlug: 'risk-management-rules-for-traders'
  },
  {
    id: 'term-rsi',
    term: 'RSI (Relative Strength Index)',
    letter: 'R',
    category: 'synthetic-indices',
    categoryLabel: 'Technical Analysis',
    definition: 'A momentum oscillator measuring the speed and change of price movements on a scale of 0 to 100, typically identifying overbought (above 70) and oversold (below 30) conditions.',
    example: 'A reading of 25 on the 14-period RSI indicates that the asset may be oversold and due for a bullish rebound.',
    relatedTerms: ['Oscillators', 'Technical Indicators', 'Divergence']
  },
  {
    id: 'term-stop-loss',
    term: 'Stop Loss Order',
    letter: 'S',
    category: 'forex',
    categoryLabel: 'Order Execution',
    definition: 'An automatic order instruction placed with a broker to close an open position once the market reaches a specified loss threshold, preventing severe drawdowns.',
    example: 'Buying GBP/USD at 1.2700 with a Stop Loss at 1.2660 limits your risk to 40 pips.',
    relatedTerms: ['Take Profit', 'Pending Order', 'Risk Management'],
    relatedArticleSlug: 'risk-management-rules-for-traders'
  },
  {
    id: 'term-spread',
    term: 'Spread',
    letter: 'S',
    category: 'forex',
    categoryLabel: 'Forex Basics',
    definition: 'The difference between the Ask price (buy price) and the Bid price (sell price) quoted for an instrument. Represents the primary transaction cost of trading.',
    example: 'If EUR/USD Bid is 1.0850 and Ask is 1.0851, the spread is 1 pip.',
    relatedTerms: ['Bid Price', 'Ask Price', 'Liquidity'],
    relatedArticleSlug: 'forex-market-hours-session-overlaps'
  },
  {
    id: 'term-take-profit',
    term: 'Take Profit Order',
    letter: 'T',
    category: 'forex',
    categoryLabel: 'Order Execution',
    definition: 'A pending order instruction that automatically closes an open position when the price reaches a designated profit level.',
    example: 'Setting a Take Profit at 1.0950 on an open EUR/USD buy position ensures your profits are banked automatically.',
    relatedTerms: ['Stop Loss', 'Pending Order', 'Risk-to-Reward']
  },
  {
    id: 'term-volatility-index',
    term: 'Volatility Indices',
    letter: 'V',
    category: 'synthetic-indices',
    categoryLabel: 'Synthetic Indices',
    definition: 'Deriv’s proprietary synthetic assets engineered to maintain a fixed, constant annualized market standard deviation (e.g. 10%, 25%, 50%, 75%, 100%) available 24/7.',
    example: 'Volatility 75 Index maintains a constant 75% volatility rate, generating uninterrupted price action around the clock.',
    relatedTerms: ['Synthetic Indices', 'Crash Indices', 'Continuous Markets'],
    relatedArticleSlug: 'mastering-volatility-indices-deriv'
  }
];
