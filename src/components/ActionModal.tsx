import { useState } from "react";
import { ArrowLeftRight, Info, X } from "lucide-react";
import type { Market } from "../data/markets";

type Props = { action: "Supply" | "Borrow"; market: Market; onClose: () => void; onSubmit: (action: "Supply" | "Borrow", symbol: string, amount: string) => void; connected: boolean };

export default function ActionModal({ action, market, onClose, onSubmit, connected }: Props) {
  const [amount, setAmount] = useState("");
  const numericAmount = Number(amount);
  const valid = Number.isFinite(numericAmount) && numericAmount > 0;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="action-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-heading"><div><span className="eyebrow">LENDING MARKET</span><h2 id="modal-title">{action} {market.symbol}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={19} /></button></div>
      <div className="modal-asset"><span className="asset-icon large" style={{ color: market.color, background: `${market.color}18` }}>{market.icon}</span><span><strong>{market.name}</strong><small>{action === "Supply" ? "Earn variable yield" : "Borrow against eligible collateral"}</small></span><span className="modal-apy">{(action === "Supply" ? market.supplyApy : market.borrowApy).toFixed(2)}% <small>APY</small></span></div>
      <label className="field-label" htmlFor="amount">Amount</label>
      <div className="amount-field"><input id="amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))} autoFocus /><span>{market.symbol}</span></div>
      <div className="amount-hint"><span>Available liquidity</span><strong>{market.available}</strong></div>
      <div className="modal-info"><Info size={17} /><p>This is a product preview. No tokens move and no transaction is submitted. A deployed Soroban lending contract and audited risk parameters are required before live lending can be enabled.</p></div>
      <button className="primary-button full-button" disabled={!valid} onClick={() => onSubmit(action, market.symbol, amount)}>{connected ? <><ArrowLeftRight size={17} /> Preview {action.toLowerCase()}</> : "Preview action"}</button>
      <p className="modal-footnote">Illustrative rates only · Not a live offer</p>
    </section>
  </div>;
}
