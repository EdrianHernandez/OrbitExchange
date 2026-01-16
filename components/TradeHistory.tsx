import React from 'react';
import { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="flex flex-col h-full bg-ex-bg border-l border-ex-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ex-border">
        <h3 className="text-sm font-semibold text-ex-text-primary">Market Trades</h3>
      </div>

      <div className="grid grid-cols-3 px-4 py-2 text-xs text-ex-text-secondary font-medium">
        <span className="text-left">Price(USDT)</span>
        <span className="text-right">Amount(BTC)</span>
        <span className="text-right">Time</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {trades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 px-4 py-1 text-xs hover:bg-ex-border/40 font-mono cursor-default">
            <span className={`text-left ${trade.type === 'buy' ? 'text-ex-green' : 'text-ex-red'}`}>
              {trade.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-right text-ex-text-primary">
              {trade.amount.toFixed(5)}
            </span>
            <span className="text-right text-ex-text-secondary">
              {trade.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};