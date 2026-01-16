import React, { useState, useEffect } from 'react';
import { TradingPairHeader } from './components/TradingPairHeader';
import { OrderBook } from './components/OrderBook';
import { TradeHistory } from './components/TradeHistory';
import { TradingChart } from './components/TradingChart';
import { Wallet, LayoutGrid } from 'lucide-react';

// --- Mock Data Generators ---

/**
 * Generates initial ticker data
 */
const generateTicker = () => ({
  symbol: 'BTC/USDT',
  lastPrice: 42150.25,
  priceChange: 1250.50,
  priceChangePercent: 3.05,
  high: 42500.00,
  low: 40800.00,
  volume: 4520.12,
  quoteVolume: 189.5,
});

/**
 * Generates mock order book data based on a price
 */
const generateOrderBook = (basePrice) => {
  const asks = [];
  const bids = [];
  
  for (let i = 0; i < 15; i++) {
    const askPrice = basePrice + (i + 1) * 5 + Math.random() * 5;
    const bidPrice = basePrice - (i + 1) * 5 - Math.random() * 5;
    
    asks.push({
      price: askPrice,
      amount: Math.random() * 2,
      total: 0, // Calculated later
      type: 'ask',
      depthPercent: Math.random() * 100
    });
    
    bids.push({
      price: bidPrice,
      amount: Math.random() * 2,
      total: 0,
      type: 'bid',
      depthPercent: Math.random() * 100
    });
  }
  
  // Calculate cumulative totals for realistic look
  asks.forEach(o => o.total = o.price * o.amount);
  bids.forEach(o => o.total = o.price * o.amount);
  
  return { asks, bids };
};

/**
 * Generates mock trade history
 */
const generateTrades = (basePrice) => {
  return Array.from({ length: 25 }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    price: basePrice + (Math.random() - 0.5) * 50,
    amount: Math.random() * 0.5,
    time: new Date(Date.now() - i * 1000).toLocaleTimeString('en-US', { hour12: false }),
    type: Math.random() > 0.5 ? 'buy' : 'sell'
  }));
};

/**
 * Generates mock candlestick chart data
 */
const generateCandles = () => {
  const data = [];
  let price = 41000;
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const time = new Date(now.getTime() - (100 - i) * 60 * 60 * 1000);
    const volatility = 100;
    const change = (Math.random() - 0.5) * volatility;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 1000;
    
    price = close;
    
    data.push({
      time: time.getHours() + ':00',
      open, high, low, close, volume
    });
  }
  return data;
};

// --- Main App Component ---

const App = () => {
  const [ticker, setTicker] = useState(generateTicker());
  const [orderBook, setOrderBook] = useState(generateOrderBook(ticker.lastPrice));
  const [trades, setTrades] = useState(generateTrades(ticker.lastPrice));
  const [candles] = useState(generateCandles());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Wiggle price
      const change = (Math.random() - 0.5) * 20;
      const newPrice = ticker.lastPrice + change;
      
      setTicker(prev => ({
        ...prev,
        lastPrice: newPrice,
        priceChange: prev.priceChange + change,
      }));

      // Update order book around new price
      setOrderBook(generateOrderBook(newPrice));

      // Add a new trade
      const newTrade = {
        id: Math.random().toString(36).substr(2, 9),
        price: newPrice + (Math.random() - 0.5) * 5,
        amount: Math.random() * 0.2,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: change > 0 ? 'buy' : 'sell'
      };
      
      setTrades(prev => [newTrade, ...prev.slice(0, 24)]);
      
    }, 2000);

    return () => clearInterval(interval);
  }, [ticker.lastPrice]);

  return (
    <div className="flex flex-col h-screen bg-ex-bg text-ex-text-primary overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <nav className="h-14 bg-ex-bg border-b border-ex-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
               <span className="font-bold text-ex-bg">O</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">OrbitExchange</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-ex-text-secondary">
            <a href="#" className="text-white">Markets</a>
            <a href="#" className="hover:text-white transition">Trade</a>
            <a href="#" className="hover:text-white transition">Derivatives</a>
            <a href="#" className="hover:text-white transition">Earn</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-ex-text-secondary hover:text-white"><LayoutGrid className="w-5 h-5" /></button>
          <button className="text-ex-text-secondary hover:text-white"><Wallet className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full bg-ex-card border border-ex-border flex items-center justify-center text-xs text-ex-text-secondary cursor-pointer">
            US
          </div>
        </div>
      </nav>

      {/* Ticker Header */}
      <div className="shrink-0">
        <TradingPairHeader data={ticker} />
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 overflow-hidden">
        
        {/* Left Column (Order Book) - Hidden on Mobile */}
        <div className="hidden lg:block lg:col-span-1 border-r border-ex-border h-full overflow-hidden">
          <OrderBook asks={orderBook.asks} bids={orderBook.bids} lastPrice={ticker.lastPrice} />
        </div>

        {/* Middle Column (Chart + Forms) */}
        <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col h-full border-r border-ex-border overflow-y-auto lg:overflow-hidden">
          {/* Chart Area */}
          <div className="h-[60vh] lg:h-[65%] w-full border-b border-ex-border">
             <TradingChart data={candles} />
          </div>
          
          {/* Order Forms */}
          <div className="flex-1 bg-ex-bg p-4 flex flex-col md:flex-row gap-4">
            {/* Buy Form */}
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-3">
                 <span className="font-medium text-ex-green">Buy BTC</span>
                 <span className="text-ex-text-secondary text-xs flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> 24,050.50 USDT
                 </span>
              </div>
              <div className="space-y-3">
                 <div className="bg-ex-card border border-ex-border rounded flex items-center px-3 py-2">
                    <span className="text-xs text-ex-text-secondary w-16">Price</span>
                    <input type="text" className="bg-transparent text-right w-full text-sm outline-none text-white font-mono" defaultValue={ticker.lastPrice.toFixed(2)} />
                    <span className="text-xs text-ex-text-muted ml-2">USDT</span>
                 </div>
                 <div className="bg-ex-card border border-ex-border rounded flex items-center px-3 py-2">
                    <span className="text-xs text-ex-text-secondary w-16">Amount</span>
                    <input type="text" className="bg-transparent text-right w-full text-sm outline-none text-white font-mono" placeholder="0.00" />
                    <span className="text-xs text-ex-text-muted ml-2">BTC</span>
                 </div>
                 <div className="pt-2">
                   <div className="w-full bg-ex-border h-1 rounded mb-4 overflow-hidden">
                      <div className="bg-ex-green w-[0%] h-full"></div>
                   </div>
                   <button className="w-full bg-ex-green hover:bg-emerald-400 text-white font-semibold py-2 rounded transition-colors text-sm">
                     Buy BTC
                   </button>
                 </div>
              </div>
            </div>

            {/* Sell Form */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-ex-border pt-4 md:pt-0 md:pl-4">
              <div className="flex justify-between text-sm mb-3">
                 <span className="font-medium text-ex-red">Sell BTC</span>
                 <span className="text-ex-text-secondary text-xs flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> 0.425 BTC
                 </span>
              </div>
              <div className="space-y-3">
                 <div className="bg-ex-card border border-ex-border rounded flex items-center px-3 py-2">
                    <span className="text-xs text-ex-text-secondary w-16">Price</span>
                    <input type="text" className="bg-transparent text-right w-full text-sm outline-none text-white font-mono" defaultValue={ticker.lastPrice.toFixed(2)} />
                    <span className="text-xs text-ex-text-muted ml-2">USDT</span>
                 </div>
                 <div className="bg-ex-card border border-ex-border rounded flex items-center px-3 py-2">
                    <span className="text-xs text-ex-text-secondary w-16">Amount</span>
                    <input type="text" className="bg-transparent text-right w-full text-sm outline-none text-white font-mono" placeholder="0.00" />
                    <span className="text-xs text-ex-text-muted ml-2">BTC</span>
                 </div>
                 <div className="pt-2">
                   <div className="w-full bg-ex-border h-1 rounded mb-4 overflow-hidden">
                      <div className="bg-ex-red w-[0%] h-full"></div>
                   </div>
                   <button className="w-full bg-ex-red hover:bg-rose-400 text-white font-semibold py-2 rounded transition-colors text-sm">
                     Sell BTC
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Trades) */}
        <div className="hidden xl:block col-span-1 h-full overflow-hidden">
           <TradeHistory trades={trades} />
        </div>

      </div>
      
      {/* Mobile Footer (Optional - placeholder) */}
      <div className="lg:hidden h-14 bg-ex-card border-t border-ex-border flex items-center justify-around px-2 shrink-0 z-50">
        <button className="flex-1 bg-ex-green text-white py-2 rounded mx-1 text-sm font-bold">Buy</button>
        <button className="flex-1 bg-ex-red text-white py-2 rounded mx-1 text-sm font-bold">Sell</button>
      </div>
    </div>
  );
};

export default App;
