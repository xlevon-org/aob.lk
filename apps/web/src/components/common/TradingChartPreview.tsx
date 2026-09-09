import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Sliders, Eye } from 'lucide-react';

interface TradingChartPreviewProps {
  symbol?: string;
  title?: string;
  description?: string;
  trend?: 'up' | 'down' | 'volatile';
}

export const TradingChartPreview: React.FC<TradingChartPreviewProps> = ({
  symbol = 'Volatility 75 (1s) Index',
  title = 'Real-time Synthetic Price Action Breakdown',
  description = 'Demonstrating 20 EMA dynamic pullback and breakout zones on a 15-minute timeframe.',
  trend = 'volatile'
}) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('15m');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA200, setShowEMA200] = useState(true);
  
  // Real-time simulated price ticker
  const [currentPrice, setCurrentPrice] = useState(14852.40);
  const [priceChange, setPriceChange] = useState(+12.80);
  const [flash, setFlash] = useState<'green' | 'red' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 3.5;
      setCurrentPrice((prev) => {
        const next = Number((prev + delta).toFixed(2));
        setFlash(delta >= 0 ? 'green' : 'red');
        setPriceChange((c) => Number((c + delta).toFixed(2)));
        setTimeout(() => setFlash(null), 400);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Pre-calculated aesthetic candlestick path coordinates
  const candles = [
    { x: 40, open: 110, close: 95, high: 90, low: 115, up: true },
    { x: 90, open: 95, close: 105, high: 88, low: 112, up: false },
    { x: 140, open: 105, close: 85, high: 80, low: 110, up: true },
    { x: 190, open: 85, close: 70, high: 65, low: 90, up: true },
    { x: 240, open: 70, close: 80, high: 66, low: 88, up: false },
    { x: 290, open: 80, close: 60, high: 55, low: 85, up: true },
    { x: 340, open: 60, close: 72, high: 58, low: 78, up: false },
    { x: 390, open: 72, close: 50, high: 45, low: 76, up: true },
    { x: 440, open: 50, close: 40, high: 36, low: 58, up: true },
    { x: 490, open: 40, close: 48, high: 38, low: 52, up: false },
    { x: 540, open: 48, close: 32, high: 28, low: 50, up: true },
    { x: 590, open: 32, close: 25, high: 22, low: 36, up: true },
  ];

  return (
    <div id="interactive-trading-chart" className="my-8 bg-[#15171c] rounded-2xl border border-[#2a2e39] overflow-hidden shadow-xl text-gray-200">
      {/* Chart Top Header Controls */}
      <div className="p-4 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#111317]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008832] animate-pulse" />
            <span className="font-bold text-white text-[15px]">{symbol}</span>
          </div>
          <span className="text-[12px] bg-[#222631] text-[#a0a6b1] px-2 py-0.5 rounded-md font-mono">
            DERIV-SIM
          </span>
        </div>

        {/* Live Price Display */}
        <div className="flex items-center gap-3">
          <div className={`font-mono text-[16px] font-bold transition-colors duration-200 ${
            flash === 'green' ? 'text-[#008832]' : flash === 'red' ? 'text-[#ff444f]' : 'text-white'
          }`}>
            {currentPrice.toFixed(2)}
          </div>
          <div className={`text-[12px] font-semibold flex items-center gap-0.5 ${priceChange >= 0 ? 'text-[#008832]' : 'text-[#ff444f]'}`}>
            {priceChange >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{priceChange >= 0 ? `+${priceChange}` : priceChange}</span>
          </div>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex items-center gap-1 bg-[#1a1d24] p-1 rounded-lg border border-[#2a2e39]">
          {(['1m', '5m', '15m', '1h', '1d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-md transition-colors uppercase ${
                timeframe === tf
                  ? 'bg-[#ff444f] text-white'
                  : 'text-[#88909e] hover:text-white hover:bg-[#252a35]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative p-6 bg-[#15171c] select-none">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
          <div className="border-b border-gray-700 w-full" />
          <div className="border-b border-gray-700 w-full" />
          <div className="border-b border-gray-700 w-full" />
          <div className="border-b border-gray-700 w-full" />
        </div>

        <svg viewBox="0 0 640 160" className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff444f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff444f" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 200 EMA Smooth Long-Term Curve */}
          {showEMA200 && (
            <path
              d="M 20,135 Q 160,120 300,105 T 620,70"
              fill="none"
              stroke="#2196f3"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          )}

          {/* 20 EMA Dynamic Trend Continuation Curve */}
          {showEMA20 && (
            <path
              d="M 20,125 Q 160,100 280,75 T 620,40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              opacity="0.9"
            />
          )}

          {/* Candlesticks or Area Line */}
          {chartType === 'candle' ? (
            candles.map((c, i) => {
              const bodyTop = Math.min(c.open, c.close);
              const bodyHeight = Math.max(Math.abs(c.close - c.open), 4);
              const color = c.up ? '#008832' : '#ff444f';
              return (
                <g key={i} className="hover:opacity-80 transition-opacity cursor-crosshair">
                  {/* Wick */}
                  <line 
                    x1={c.x} 
                    y1={c.high} 
                    x2={c.x} 
                    y2={c.low} 
                    stroke={color} 
                    strokeWidth="1.5" 
                  />
                  {/* Real Body */}
                  <rect
                    x={c.x - 7}
                    y={bodyTop}
                    width={14}
                    height={bodyHeight}
                    rx={1.5}
                    fill={color}
                  />
                </g>
              );
            })
          ) : (
            <>
              <path
                d="M 40,110 L 90,105 L 140,85 L 190,70 L 240,80 L 290,60 L 340,72 L 390,50 L 440,40 L 490,48 L 540,32 L 590,25 L 590,150 L 40,150 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 40,110 L 90,105 L 140,85 L 190,70 L 240,80 L 290,60 L 340,72 L 390,50 L 440,40 L 490,48 L 540,32 L 590,25"
                fill="none"
                stroke="#ff444f"
                strokeWidth="2.5"
              />
            </>
          )}

          {/* Dynamic Resistance Target Callout Tag */}
          <g transform="translate(480, 22)">
            <rect width="130" height="24" rx="4" fill="#ff444f" />
            <text x="65" y="16" fill="white" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Breakout Zone: 14,880
            </text>
          </g>
        </svg>
      </div>

      {/* Chart Footer Controls & Indicators Toggle */}
      <div className="p-3.5 bg-[#111317] border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
        <div className="flex items-center gap-4">
          <span className="text-[#88909e] font-medium">Overlays:</span>
          <button
            onClick={() => setShowEMA20(!showEMA20)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer ${
              showEMA20 ? 'text-[#f59e0b] bg-[#f59e0b]/10 font-medium' : 'text-[#6e6e6e]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>20 EMA</span>
          </button>
          <button
            onClick={() => setShowEMA200(!showEMA200)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer ${
              showEMA200 ? 'text-[#2196f3] bg-[#2196f3]/10 font-medium' : 'text-[#6e6e6e]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2196f3]" />
            <span>200 EMA</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType(chartType === 'candle' ? 'line' : 'candle')}
            className="text-[12px] text-[#a0a6b1] hover:text-white px-2.5 py-1 bg-[#1d212b] rounded-md border border-[#2a2e39] transition-colors cursor-pointer"
          >
            Display: <span className="font-semibold text-white capitalize">{chartType}s</span>
          </button>
        </div>
      </div>

      {/* Contextual Annotation */}
      <div className="px-4 py-2.5 bg-[#161a23] text-[12px] text-[#8e96a4] border-t border-[#222733] flex items-center justify-between">
        <span>{title} — {description}</span>
        <span className="text-[#ff444f] font-semibold text-[11px] uppercase tracking-wider">Deriv Technical Analysis</span>
      </div>
    </div>
  );
};
