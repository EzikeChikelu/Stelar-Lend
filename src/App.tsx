import { useMemo, useState } from "react";
import { Activity, ArrowDownLeft, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, ChevronDown, CircleHelp, Compass, CreditCard, ExternalLink, Eye, EyeOff, FileText, LayoutDashboard, LifeBuoy, Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, Wallet, X, Zap } from "lucide-react";
import MetricCard from "./components/MetricCard";
import MarketTable from "./components/MarketTable";
import ActionModal from "./components/ActionModal";
import { activity as seedActivity, markets } from "./data/markets";
import { connectFreighter } from "./lib/wallet";

type ModalState = { action: "Supply" | "Borrow"; symbol: string } | null;
type NavItem = "Overview" | "Markets" | "Your positions" | "Activity";

const navItems: { label: NavItem; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Markets", icon: Compass },
  { label: "Your positions", icon: CreditCard },
  { label: "Activity", icon: Activity },
];

function shortAddress(address: string) { return `${address.slice(0, 5)}…${address.slice(-5)}`; }

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>("Overview");
  const [modal, setModal] = useState<ModalState>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  const filteredMarkets = useMemo(() => markets.filter((market) => `${market.symbol} ${market.name}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const selectedMarket = modal ? markets.find((market) => market.symbol === modal.symbol) : undefined;

  async function handleConnect() {
    setConnecting(true); setWalletError("");
    try {
      const connection = await connectFreighter();
      setWallet(connection.address);
      setToast("Wallet connected. You're viewing demo market data.");
      window.setTimeout(() => setToast(""), 4200);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Could not connect to Freighter.");
    } finally { setConnecting(false); }
  }

  function handlePreview(action: "Supply" | "Borrow", symbol: string, amount: string) {
    setModal(null);
    setToast(`${action} preview created for ${amount} ${symbol}. No transaction was sent.`);
    window.setTimeout(() => setToast(""), 5000);
  }

  const isOverview = activeNav === "Overview";
  const title = activeNav === "Overview" ? "Overview" : activeNav === "Markets" ? "Lending markets" : activeNav === "Your positions" ? "Your positions" : "Activity";
  const description = activeNav === "Overview" ? "Your on-chain lending, at a glance." : activeNav === "Markets" ? "Explore assets and compare variable lending rates." : activeNav === "Your positions" ? "Track supplied assets, debt, and collateral health." : "A transparent view of your lending activity.";

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setActiveNav("Overview"); setMobileNav(false); }}><span className="brand-mark"><span /><span /><span /></span><span className="brand-name">lumen<span className="brand-dot">.</span><small>STELLAR LENDING</small></span></a>
      <div className="network-select-wrap"><button className="network-select" onClick={() => setShowNetwork(!showNetwork)}><span className="network-dot" /><span><strong>Stellar testnet</strong><small>Network environment</small></span><ChevronDown size={15} /></button>{showNetwork && <div className="network-popover"><strong><span className="network-dot" /> Stellar Testnet</strong><p>Prototype environment. No mainnet transactions are enabled.</p><a href="https://developers.stellar.org/" target="_blank" rel="noreferrer">Stellar developer docs <ExternalLink size={12} /></a></div>}</div>
      <div className="nav-section"><span className="nav-caption">WORKSPACE</span>{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); setMobileNav(false); }}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === "Markets" && <span className="nav-count">4</span>}</button>)}</div>
      <div className="nav-section protocol-section"><span className="nav-caption">PROTOCOL</span><button className="nav-item" onClick={() => setToast("Risk center is coming soon. No live collateral data is available yet.")}><ShieldCheck size={18} /><span>Risk center</span><span className="soon-tag">SOON</span></button><button className="nav-item" onClick={() => setToast("Governance is not configured for this prototype.")}><FileText size={18} /><span>Governance</span></button></div>
      <div className="sidebar-spacer" />
      <div className="sidebar-promo"><div className="promo-orbit"><Sparkles size={18} /></div><strong>Lending, made clearer.</strong><p>Built for a more open financial system on Stellar.</p><a href="https://stellar.org/" target="_blank" rel="noreferrer">Discover Stellar <ArrowUpRight size={14} /></a></div>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setToast("Help center will be available with the production launch.")}><LifeBuoy size={18} /><span>Help center</span><ExternalLink size={13} className="end-icon" /></button><button className="nav-item" onClick={() => setToast("Settings are not configured in this preview.")}><Settings2 size={18} /><span>Settings</span></button><div className="profile-row"><span className="profile-avatar">L</span><span className="profile-info"><strong>{wallet ? shortAddress(wallet) : "Guest account"}</strong><small>{wallet ? "Freighter connected" : "Connect to get started"}</small></span><MoreHorizontal size={18} /></div></div>
    </aside>

    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">{mobileNav ? <X size={20} /> : <Menu size={20} />}</button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{title}</strong></div></div><div className="topbar-actions"><span className="testnet-pill"><span className="network-dot" /> Testnet preview</span><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You're all caught up.")}><Bell size={18} /><i /></button>{wallet ? <button className="wallet-button connected" onClick={() => setToast(`Connected: ${wallet}`)}><span className="wallet-status-dot" />{shortAddress(wallet)}<ChevronDown size={14} /></button> : <button className="wallet-button" onClick={handleConnect} disabled={connecting}><Wallet size={16} />{connecting ? "Connecting…" : "Connect wallet"}</button>}</div></header>

      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow"><span className="live-indicator" /> STELLAR LENDING PROTOCOL</div><h1>{title}<span className="heading-period">.</span></h1><p>{description}</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => setShowBalance(!showBalance)}>{showBalance ? <Eye size={16} /> : <EyeOff size={16} />}{showBalance ? "Hide balances" : "Show balances"}</button><button className="primary-button" onClick={() => setModal({ action: "Supply", symbol: "USDC" })}><Plus size={17} /> Supply assets</button></div></div>

        {walletError && <div className="inline-error"><CircleHelp size={17} /><span>{walletError}</span><button onClick={() => setWalletError("")} aria-label="Dismiss error"><X size={16} /></button></div>}
        <div className="demo-notice"><span className="notice-icon"><Zap size={15} /></span><span><strong>Preview environment</strong> — figures below are illustrative demo data, not live protocol balances or executable markets.</span><button onClick={() => setToast("Live lending will require an audited Soroban contract, verified market data, and testnet validation.")}>Learn more <ArrowRight size={13} /></button></div>

        {(isOverview || activeNav === "Your positions") && <>
          <section className="metrics-grid">
            <MetricCard label="Total supplied" value={showBalance ? "$24,580.42" : "••••••"} detail="+8.42%" icon={<ArrowUpRight size={18} />} />
            <MetricCard label="Total borrowed" value={showBalance ? "$6,240.00" : "••••••"} detail="12.8%" positive={false} icon={<ArrowDownRight size={18} />} />
            <MetricCard label="Net APY" value={showBalance ? "5.24%" : "••••"} detail="+0.62%" icon={<Zap size={18} />} />
            <MetricCard label="Health factor" value={showBalance ? "2.48" : "••••"} detail="Healthy" icon={<ShieldCheck size={18} />} />
          </section>
          <section className="portfolio-grid">
            <article className="panel portfolio-panel"><div className="panel-heading"><div><span className="panel-kicker">PORTFOLIO OVERVIEW</span><h2>Your lending position</h2></div><button className="period-select" onClick={() => setToast("The portfolio chart is illustrative sample data.")}>30 days <ChevronDown size={14} /></button></div><div className="portfolio-summary"><div><span className="summary-label">Net portfolio value</span><div className="summary-value">{showBalance ? "$18,340.42" : "••••••"} <span className="summary-change"><ArrowUpRight size={14} /> 6.8%</span></div></div><div className="chart-legend"><span><i className="legend-dot purple" /> Supplied</span><span><i className="legend-dot green" /> Borrowed</span></div></div><div className="chart-area"><div className="chart-y-labels"><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div><svg className="portfolio-chart" viewBox="0 0 680 190" preserveAspectRatio="none" role="img" aria-label="Illustrative portfolio value chart"><defs><linearGradient id="supplyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a88bfa" stopOpacity=".25" /><stop offset="100%" stopColor="#a88bfa" stopOpacity="0" /></linearGradient></defs>{[20,68,116,164].map(y => <line key={y} x1="0" x2="680" y1={y} y2={y} stroke="#27313c" strokeDasharray="4 6" />)}<path d="M0 147 C40 137 52 147 86 126 S135 117 170 127 S217 99 255 104 S302 91 340 99 S382 73 420 85 S469 56 505 67 S556 48 590 55 S644 23 680 31 L680 180 L0 180Z" fill="url(#supplyFill)" /><path d="M0 147 C40 137 52 147 86 126 S135 117 170 127 S217 99 255 104 S302 91 340 99 S382 73 420 85 S469 56 505 67 S556 48 590 55 S644 23 680 31" fill="none" stroke="#b39aff" strokeWidth="2.5" strokeLinecap="round" /><path d="M0 168 C40 164 52 168 86 157 S135 160 170 153 S217 147 255 151 S302 138 340 145 S382 134 420 141 S469 125 505 132 S556 122 590 128 S644 112 680 116" fill="none" stroke="#80d9bb" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4" /></svg></div><div className="chart-x-labels"><span>Sep 22</span><span>Sep 29</span><span>Oct 06</span><span>Oct 13</span><span>Oct 22</span></div><div className="chart-footnote"><span><span className="tiny-live-dot" /> Sample portfolio trend</span><span>Values shown for UI demonstration</span></div></article>
            <article className="panel allocation-panel"><div className="panel-heading"><div><span className="panel-kicker">ASSET MIX</span><h2>Portfolio allocation</h2></div><button className="icon-button subtle-icon" onClick={() => setToast("Allocation is based on sample portfolio values.")} aria-label="About portfolio allocation"><MoreHorizontal size={19} /></button></div><div className="donut-wrap"><div className="donut-chart"><div className="donut-center"><strong>4</strong><span>assets</span></div></div></div><div className="allocation-list">{[{symbol:"USDC",name:"USD Coin",percent:48,color:"#7ca8ff",value:"$11,798.60"},{symbol:"XLM",name:"Stellar Lumens",percent:29,color:"#b6a4ff",value:"$7,128.32"},{symbol:"EURC",name:"Euro Coin",percent:15,color:"#80d9bb",value:"$3,687.06"},{symbol:"yXLM",name:"Yield XLM",percent:8,color:"#ffc17a",value:"$1,966.44"}].map((asset)=><div className="allocation-row" key={asset.symbol}><span className="allocation-name"><i style={{background:asset.color}} /><span><strong>{asset.symbol}</strong><small>{asset.name}</small></span></span><span className="allocation-value"><strong>{showBalance ? asset.value : "••••"}</strong><small>{asset.percent}%</small></span></div>)}</div></article>
          </section>
        </>}

        {(isOverview || activeNav === "Markets") && <section className="panel markets-panel"><div className="panel-heading market-panel-heading"><div><span className="panel-kicker">EXPLORE THE PROTOCOL</span><h2>Markets <span className="market-count">04</span></h2><p>Compare rates and available liquidity across supported assets.</p></div><div className="market-tools"><label className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assets" aria-label="Search markets" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={13} /></button>}</label><button className="secondary-button filters-button" onClick={() => setToast("All markets are currently shown. Filters arrive with live protocol indexing.")}><Settings2 size={15} /> Filters</button></div></div><MarketTable markets={filteredMarkets} onAction={(action, symbol) => setModal({ action, symbol })} />{filteredMarkets.length === 0 && <div className="empty-state"><Search size={22} /><strong>No assets found</strong><span>Try another symbol or asset name.</span></div>}<div className="market-footer"><span>Rates are variable and for demonstration only.</span><button onClick={() => setToast("Market details will be available when verified contract data is connected.")}>View market methodology <ArrowRight size={14} /></button></div></section>}

        {(isOverview || activeNav === "Activity") && <section className="panel activity-panel"><div className="panel-heading"><div><span className="panel-kicker">YOUR HISTORY</span><h2>Recent activity</h2><p>Sample events to preview the transaction history layout.</p></div><button className="text-button" onClick={() => setActiveNav("Activity")}>View all <ArrowRight size={14} /></button></div><div className="activity-list">{seedActivity.map((item, index) => <div className="activity-row" key={item.type + item.asset}><span className="activity-icon" style={{color:item.color,background:`${item.color}18`}}>{index === 0 ? <ArrowDownLeft size={17} /> : index === 1 ? <Zap size={17} /> : <ArrowDownRight size={17} />}</span><span className="activity-description"><strong>{item.type} {item.asset}</strong><small>{item.date} · Sample activity</small></span><span className="activity-amount"><strong>{item.type === "Interest earned" ? "+" : item.type === "Borrow" ? "−" : "+"}{item.amount} {item.asset}</strong><small><span className="confirmed-dot" /> {item.status} · Demo</small></span><button className="icon-button activity-more" onClick={() => setToast("This is sample history. Transaction hashes are not available.")} aria-label="Activity details"><MoreHorizontal size={18} /></button></div>)}</div></section>}

        <footer className="page-footer"><div><span className="footer-logo">lumen<span>.</span></span><span>Built on Stellar · Designed for open finance</span></div><div><span><i className="network-dot" /> Prototype mode</span><a href="https://stellar.org/" target="_blank" rel="noreferrer">Stellar network <ExternalLink size={12} /></a><a href="https://developers.stellar.org/docs/build/smart-contracts/overview" target="_blank" rel="noreferrer">Soroban docs <ExternalLink size={12} /></a></div></footer>
      </div>
    </main>
    {toast && <div className="toast" role="status"><span className="toast-check"><ShieldCheck size={16} /></span><span>{toast}</span><button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={15} /></button></div>}
    {modal && selectedMarket && <ActionModal action={modal.action} market={selectedMarket} onClose={() => setModal(null)} onSubmit={handlePreview} connected={Boolean(wallet)} />}
  </div>;
}
