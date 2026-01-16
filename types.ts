export interface Order {
  price: number;
  amount: number;
  total: number;
  type: 'bid' | 'ask';
  depthPercent: number; // For visualization 0-100
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerData {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
}
