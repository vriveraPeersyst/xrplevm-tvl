import { useMemo, useState } from 'react';
import { useRows } from '../hooks/useRows';
import { Filters } from './Filters';
import { Table } from './Table';

function Dashboard() {
  const { rows, total, loading } = useRows();
  const [src, setSrc] = useState('all');
  const [dst, setDst] = useState('all');
  const [sym, setSym] = useState('all');

  const list = useMemo(
    () =>
      rows.filter(
        r =>
          (src === 'all' || r.source === src) &&
          (dst === 'all' || r.dest === dst) &&
          (sym === 'all' || r.symbol === sym),
      ),
    [rows, src, dst, sym],
  );

  return (
    <div className="max-w-5xl mx-auto py-10 font-work text-white px-4">
      <h2 className="text-center text-4xl font-extrabold text-lightPurple mb-2">
        XRPL EVM ecosystem TVL
      </h2>
      <p className="text-center text-green text-3xl mb-8">
        {loading
          ? 'Loading…'
          : total.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
      </p>

      {/* filters */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        <Filters
          label="Source"
          value={src}
          onChange={setSrc}
          opts={['all', ...new Set(rows.map(r => r.source))]}
        />
        <Filters
          label="Destination"
          value={dst}
          onChange={setDst}
          opts={['all', ...new Set(rows.map(r => r.dest))]}
        />
        <Filters
          label="Symbol"
          value={sym}
          onChange={setSym}
          opts={['all', ...new Set(rows.map(r => r.symbol))]}
        />
      </div>

      <Table rows={list} loading={loading} />
    </div>
  );
}
export default Dashboard;
