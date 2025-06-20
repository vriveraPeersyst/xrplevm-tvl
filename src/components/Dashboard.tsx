import { useMemo, useState, useRef } from 'react';
import { useRows } from '../hooks/useRows';
import { Filters } from './Filters';
import { Table } from './Table';
import { getSwapUrl } from '../utils/getSwapUrl';
import type { Row } from '../types';

function Dashboard() {
  const { rows, total, loading } = useRows();
  const [src, setSrc] = useState('all');
  const [dst, setDst] = useState('all');
  const [sym, setSym] = useState('all');

  const [baseAsset, setBaseAsset] = useState<Row | null>(null);
  const [highlightedKey, setHighlightedKey] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  function handleRowClick(row: Row) {
    if (!baseAsset) {
      setBaseAsset(row);
      setHighlightedKey(row.key);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setBaseAsset(null);
        setHighlightedKey(undefined);
      }, 5000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const url = getSwapUrl(baseAsset, row);
      window.open(url, '_blank');
      setBaseAsset(null);
      setHighlightedKey(undefined);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-5 font-work text-white px-1 text-base md:text-lg">
      <h2 className="text-center text-2xl md:text-4xl font-extrabold text-lightPurple mb-8 md:mb-10">
        XRPL EVM ecosystem TVL
      </h2>
      <p className="text-center text-green text-3xl md:text-5xl mb-6 md:mb-8 min-h-[3.5rem] flex items-center justify-center">
        {loading ? (
          <span
            className="inline-block animate-spin mr-2 align-middle"
            style={{
              width: '1.5rem',
              height: '1.5rem',
              border: '2px solid #32E685',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
            }}
          ></span>
        ) : (
          '$' + total.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })
        )}
      </p>

      {/* filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 justify-center mb-4 md:mb-6 text-sm md:text-base min-w-xl mx-auto">
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
      <div className="w-full overflow-x-auto">
        <div className="min-w-[350px]">
          <Table
            rows={list}
            loading={loading}
            onRowClick={handleRowClick}
            highlightedKey={highlightedKey}
          />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
