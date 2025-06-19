import { Avatar } from './Avatar';
import type { Row } from '../types';

export const Table=({rows,loading}:{rows:Row[],loading:boolean})=>(
  <div className="overflow-x-auto rounded-xl shadow bg-darkPurple/90">
    <table className="min-w-full">
      <thead>
        <tr className="bg-darkPurple/95 text-lightPurple text-lg">
          {['Source','Destination','Symbol','Quantity','TVL (USD)'].map(h=>
            <th key={h} className="py-4 px-6 font-semibold text-center">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {loading?(
          <tr><td colSpan={5} className="py-6 text-center"><span className="animate-pulse text-lightPurple">Loading…</span></td></tr>
        ):rows.map(r => (
          <tr key={r.key} className="border-b border-black/30 even:bg-black/10 text-center">
            <td className="py-3 px-6">{r.source}</td>
            <td className="py-3 px-6">{r.dest}</td>
            <td className="py-3 px-6 font-semibold">
              <Avatar src={r.logo}/> <Avatar src={r.chainLogo} size={16}/>
              {r.symbol}
            </td>
            <td className="py-3 px-6 font-mono">{r.quantity.toLocaleString()}</td>
            <td className="py-3 px-6 font-mono text-green">
              {r.valueUsd.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2})}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
