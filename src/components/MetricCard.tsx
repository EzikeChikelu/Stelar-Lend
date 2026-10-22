import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Props = {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
  icon: ReactNode;
};

export default function MetricCard({ label, value, detail, positive = true, icon }: Props) {
  return (
    <article className="metric-card">
      <div className="metric-top"><span className="metric-label">{label}</span><span className="metric-icon">{icon}</span></div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom"><span className={positive ? "change positive" : "change neutral"}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{detail}</span><span className="metric-caption">vs. last 30 days</span></div>
    </article>
  );
}
