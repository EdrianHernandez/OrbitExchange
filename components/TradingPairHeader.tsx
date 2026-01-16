import React from 'react';
import { TickerData } from '../types';
import { ChevronDown } from 'lucide-react';

interface TradingPairHeaderProps {
  data: TickerData;
}

export const TradingPairHeader: React.FC<TradingPairHeaderProps> = ({ data }) => {
  const isPositive = data.priceChange >= 0;

  const formatPrice = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatVol = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 bg-ex-bg border-b border-ex-border">
      <div className="flex items-center gap-6 mb-2 md:mb-0">
        <div className="flex items-center group cursor-pointer">
          <h1 className="text-xl font-bold text-ex-text-primary font-sans group-hover:text-amber-400 transition-colors">
            {data.symbol}
          </h1>
          <ChevronDown className="w-4 h-4 ml-1 text-ex-text-secondary" />
        </div>
        
        <div className="flex flex-col">
          <span className={`text-lg font-mono font-medium ${isPositive ? 'text-ex-green' : 'text-ex-red'}`}>
            {formatPrice(data.lastPrice)}
          </span>
          <span className="text-xs text-ex-text-primary font-mono underline decoration-dotted decoration-ex-text-muted cursor-pointer">
            ${formatPrice(data.lastPrice)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full md:w-auto text-xs font-mono no-scrollbar">
        <div className="flex flex-col min-w-max">
          <span className="text-ex-text-secondary mb-0.5">24h Change</span>
          <span className={isPositive ? 'text-ex-green' : 'text-ex-red'}>
            {formatPrice(data.priceChange)} {isPositive ? '+' : ''}{data.priceChangePercent}%
          </span>
        </div>
        <div className="flex flex-col min-w-max">
          <span className="text-ex-text-secondary mb-0.5">24h High</span>
          <span className="text-ex-text-primary">{formatPrice(data.high)}</span>
        </div>
        <div className="flex flex-col min-w-max">
          <span className="text-ex-text-secondary mb-0.5">24h Low</span>
          <span className="text-ex-text-primary">{formatPrice(data.low)}</span>
        </div>
        <div className="flex flex-col min-w-max">
          <span className="text-ex-text-secondary mb-0.5">24h Vol(BTC)</span>
          <span className="text-ex-text-primary">{formatVol(data.volume)}</span>
        </div>
        <div className="flex flex-col min-w-max">
          <span className="text-ex-text-secondary mb-0.5">24h Vol(USDT)</span>
          <span className="text-ex-text-primary">{formatVol(data.quoteVolume)}M</span>
        </div>
      </div>
    </div>
  );
};