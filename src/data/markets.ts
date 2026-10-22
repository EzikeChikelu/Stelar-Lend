export type Market = {
  symbol: string;
  name: string;
  issuer: string;
  icon: string;
  color: string;
  supplied: string;
  borrowed: string;
  supplyApy: number;
  borrowApy: number;
  available: string;
  utilization: number;
  trend: number[];
};

export const markets: Market[] = [
  { symbol: "XLM", name: "Stellar Lumens", issuer: "Native asset", icon: "✦", color: "#b6a4ff", supplied: "$8.42M", borrowed: "$4.96M", supplyApy: 4.82, borrowApy: 7.35, available: "$3.46M", utilization: 58.9, trend: [22, 27, 24, 34, 29, 41, 38, 46, 43, 57, 52, 64] },
  { symbol: "USDC", name: "USD Coin", issuer: "Circle • Stellar", icon: "$", color: "#7ca8ff", supplied: "$12.86M", borrowed: "$8.18M", supplyApy: 6.24, borrowApy: 9.18, available: "$4.68M", utilization: 63.6, trend: [24, 22, 29, 27, 39, 34, 44, 41, 49, 45, 59, 63] },
  { symbol: "EURC", name: "Euro Coin", issuer: "Circle • Stellar", icon: "€", color: "#80d9bb", supplied: "$3.28M", borrowed: "$1.16M", supplyApy: 3.91, borrowApy: 6.42, available: "$2.12M", utilization: 35.4, trend: [25, 31, 28, 37, 33, 40, 38, 44, 41, 49, 47, 54] },
  { symbol: "yXLM", name: "Yield XLM", issuer: "Yield-bearing asset", icon: "↗", color: "#ffc17a", supplied: "$1.94M", borrowed: "$0.86M", supplyApy: 5.67, borrowApy: 8.54, available: "$1.08M", utilization: 44.3, trend: [19, 24, 22, 29, 34, 30, 41, 38, 47, 44, 52, 60] },
];

export const activity = [
  { type: "Supply", asset: "USDC", amount: "2,500.00", date: "Oct 21, 2026", status: "Confirmed", color: "#7ca8ff" },
  { type: "Interest earned", asset: "XLM", amount: "18.42", date: "Oct 20, 2026", status: "Confirmed", color: "#b6a4ff" },
  { type: "Borrow", asset: "USDC", amount: "750.00", date: "Oct 18, 2026", status: "Confirmed", color: "#80d9bb" },
];
