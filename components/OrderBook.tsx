import React from 'react';
import { Order } from '../types';
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';

interface OrderBookProps {
  asks: Order[];
  bids: Order[];
  lastPrice: number;
}

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  const isBid = order.type === 'bid';
  return (
    <div className="relative grid grid-cols-3 text-xs py-0.5 hover:bg-ex-border/40 cursor-pointer font-mono group">
      {/* Depth Visualization Background */}
      <div 
        className={`absolute top-0 bottom-0 ${isBid ? 'right-0 bg-ex-greenBg' : 'right-0 bg-ex-redBg'} transition-all duration-300 opacity-50`}
        style={{ width: `${order.depthPercent}%` }}
      />
      
      <span className={`relative z-10 pl-4 text-left ${isBid ? 'text-ex-green' : 'text-ex-red'}`}>
        {order.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
      <span className="relative z-10 text-right text-ex-text-primary group-hover:text-white">
        {order.amount.toFixed(5)}
      </span>
      <span className="relative z-10 pr-4 text-right text-ex-text-secondary">
        {order.total.toFixed(2)}
      </span>
    </div>
  );
};

export const OrderBook: React.FC<OrderBookProps> = ({ asks, bids, lastPrice }) => {
  return (
    <div className="flex flex-col h-full bg-ex-bg border-l border-b md:border-b-0 border-ex-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ex-border">
        <h3 className="text-sm font-semibold text-ex-text-primary">Order Book</h3>
        <MoreHorizontal className="w-4 h-4 text-ex-text-secondary cursor-pointer hover:text-white" />
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-4 py-2 text-xs text-ex-text-secondary font-medium">
        <span className="text-left">Price(USDT)</span>
        <span className="text-right">Amount(BTC)</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells) - Reversed to show lowest ask at bottom */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex flex-col justify-end h-full pb-1">
          {asks.slice().reverse().map((ask, i) => (
             <OrderRow key={`ask-${i}`} order={ask} />
          ))}
        </div>
      </div>

      {/* Last Price Indicator */}
      <div className="flex items-center justify-center gap-2 py-3 my-1 border-y border-ex-border bg-ex-bg z-10">
        <span className="text-lg font-bold text-ex-green font-mono">
          {lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <ArrowUp className="w-4 h-4 text-ex-green" />
        <span className="text-xs text-ex-text-secondary">
          $42,150.25
        </span>
      </div>

      {/* Bids (Buys) */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex flex-col pt-1">
          {bids.map((bid, i) => (
            <OrderRow key={`bid-${i}`} order={bid} />
          ))}
        </div>
      </div>
      
      {/* Sticky footer for aggregation toggles (Visual only) */}
      <div className="px-4 py-3 mt-auto flex items-center justify-center border-t border-ex-border">
         <div className="flex gap-1">
            <button className="p-1 rounded bg-ex-border hover:bg-gray-600 transition">
                <div className="w-4 h-4 bg-ex-green rounded-sm opacity-50"></div>
            </button>
            <button className="p-1 rounded hover:bg-ex-border transition">
                 <div className="w-4 h-4 bg-ex-red rounded-sm opacity-50"></div>
            </button>
         </div>
      </div>
    </div>
  );
};