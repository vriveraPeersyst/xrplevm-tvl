import React from 'react';
import { CHAINS } from '../config/chains';
import { useTotalSupply } from '../hooks/useTotalSupply';
import { NetworkSelector } from './NetworkSelector';
import type { Env } from '../types';

interface Props { env: Env; onEnvChange: (env: Env) => void; }

export const Dashboard: React.FC<Props> = ({ env, onEnvChange }) => {
  const { data, loading } = useTotalSupply(env, CHAINS);

  return (
    <div className="max-w-2xl mx-auto mt-16 flex flex-col items-center font-work">
      <h2 className="text-4xl font-bold text-lightPurple mb-4 text-center tracking-tight">
        XRP Total Supply on IBC
      </h2>
      <div className="mb-8">
        <NetworkSelector env={env} onChange={onEnvChange} />
      </div>
      <div className="w-full rounded-2xl overflow-hidden shadow-xl bg-darkPurple/90">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-8 py-5 text-left text-lightPurple text-xl font-semibold bg-darkPurple/95">
                Chain
              </th>
              <th className="px-8 py-5 text-left text-lightPurple text-xl font-semibold bg-darkPurple/95">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {CHAINS.map((chain, idx) => (
              <tr
                key={chain.key}
                className={
                  idx === CHAINS.length - 1
                    ? ''
                    : 'border-b border-black/30'
                }
                style={{
                  background: idx % 2 === 0 ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.04)'
                }}
              >
                <td className="px-8 py-6 text-white font-medium text-lg">{chain.displayName}</td>
                <td className="px-8 py-6">
                  {loading
                    ? <span className="text-lightPurple animate-pulse">Loading…</span>
                    : data[chain.key]?.error
                      ? <span className="text-red-400">{data[chain.key]?.error}</span>
                      : <span className="text-green font-mono text-xl">{data[chain.key]?.amount ?? '0'}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
