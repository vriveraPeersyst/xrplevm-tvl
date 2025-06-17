import React from 'react';

interface Props {
  chainName: string;
  amount: string | null;
  error?: string;
  loading?: boolean;
}

export const SupplyCard: React.FC<Props> = ({ chainName, amount, error, loading = false }) => (
  <div className="bg-darkPurple rounded-2xl shadow p-6 flex flex-col items-center">
    <h3 className="text-lg font-bold text-white">{chainName}</h3>
    {loading ? (
      <p className="mt-4 animate-pulse text-lightPurple">Loading…</p>
    ) : error ? (
      <p className="text-red-400 mt-2">{error}</p>
    ) : (
      <p className="text-2xl mt-4 font-mono text-green">{amount ?? '0'}</p>
    )}
  </div>
);
