import { Avatar } from './Avatar';
import type { Row } from '../types';

export const Table = ({ rows, loading }: { rows: Row[], loading: boolean }) => (
  <div className="overflow-x-auto rounded-xl shadow bg-darkPurple/90">
    <table className="min-w-full">
      <thead>
        <tr className="bg-darkPurple/95 text-lightPurple text-lg">
          {['', 'Symbol', 'Source', 'Destination', 'Quantity', 'TVL (USD)'].map((h, i) =>
            <th key={h + i} className={
              i === 0
                ? "py-4 px-2 font-semibold text-center w-12"
                : "py-4 px-6 font-semibold text-center"
            }>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={6} className="py-6 text-center"><span className="animate-pulse text-lightPurple">Loading…</span></td></tr>
        ) : rows.map(r => (
          <tr
            key={r.key}
            className="border-b border-black/30 even:bg-black/10 text-center group cursor-pointer transition-all duration-200"
            style={{ position: 'relative', zIndex: 0, transitionProperty: 'box-shadow, transform, background-color', willChange: 'transform, box-shadow' }}
            onMouseEnter={e => {
              e.currentTarget.style.zIndex = '20';
              e.currentTarget.style.boxShadow = '0 2px 2px 0 rgba(200,144,255,0.25), 0 1.5px 2px 0 rgba(50,230,133,0.10)';
              e.currentTarget.style.transform = 'scale(1.025)';
              e.currentTarget.style.background = 'rgba(200,144,255,0.10)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.zIndex = '0';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.background = '';
            }}
          >
            <td className="py-3 px-8 text-center align-middle"><Avatar src={r.logo} /></td>
            <td className="py-3 px-6 font-semibold align-middle">{r.symbol}</td>
            <td className="py-3 px-2 align-middle">{r.source}</td>
            <td className="py-3 px-2 align-middle">{r.dest}</td>
            <td className="py-3 px-6 font-mono align-middle">{r.quantity.toLocaleString()}</td>
            <td className="py-3 px-6 font-mono text-green align-middle">
              {r.valueUsd.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
