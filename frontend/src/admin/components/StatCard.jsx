import '../style/StatCard.css';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function StatCard({ title, value, change, secondaryText, isPositive, bgClass }) {
  return (
    <div className={`stat-card ${bgClass}`}>
      <h4 className="stat-title">{title}</h4>
      <div className="stat-value">{value}</div>

      <div className="stat-change-container">
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUp size={14} className="icon" /> : <ArrowDown size={14} className="icon" />}
          {change}
        </div>

        {secondaryText && <span className="secondary-text">({secondaryText})</span>}
      </div>
    </div>
  );
}
