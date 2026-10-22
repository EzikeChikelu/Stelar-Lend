import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { Market } from "../data/markets";

type Props = { markets: Market[]; onAction: (action: "Supply" | "Borrow", symbol: string) => void };

function MiniTrend({ values }: { values: number[] }) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${34 - value * 0.42}`).join(" ");
  return <svg className="mini-trend" viewBox="0 0 100 34" preserveAspectRatio="none" aria-label="Illustrative market trend"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function MarketTable({ markets, onAction }: Props) {
  return (
    <div className="market-table-wrap">
      <table className="market-table">
        <thead><tr><th>Asset</th><th>Supply APY</th><th>Borrow APY</th><th>Liquidity available</th><th>7d trend</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{markets.map((market) => <tr key={market.symbol}>
          <td><div className="asset-cell"><span className="asset-icon" style={{ color: market.color, background: `${market.color}18` }}>{market.icon}</span><span><strong>{market.symbol}</strong><small>{market.name}</small></span></div></td>
          <td><span className="apy supply-apy">{market.supplyApy.toFixed(2)}%</span><small className="cell-sub">Variable</small></td>
          <td><span className="apy">{market.borrowApy.toFixed(2)}%</span><small className="cell-sub">Variable</small></td>
          <td><strong>{market.available}</strong><div className="utilization"><span style={{ width: `${market.utilization}%` }} /></div><small className="cell-sub">{market.utilization}% utilized</small></td>
          <td><MiniTrend values={market.trend} /></td>
          <td><button className="row-action" onClick={() => onAction("Supply", market.symbol)} aria-label={`View ${market.symbol} supply options`}><ArrowUpRight size={16} /></button></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}
