import React from 'react';

interface Props {
  env: 'testnet' | 'mainnet';
  onChange: (env: 'testnet'|'mainnet') => void;
}

export const NetworkSelector: React.FC<Props> = ({ env, onChange }) => (
  <div className="flex space-x-2 bg-black/70 rounded-full px-2 py-2 border border-lightPurple shadow font-work">
    {(['testnet','mainnet'] as const).map(e => (
      <button
        key={e}
        onClick={() => onChange(e)}
        className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-150
          ${env===e
            ? 'bg-lightPurple text-gray-400 shadow-md'
            : 'bg-transparent text-lightPurple hover:bg-lightPurple/20'
          }`}
        style={{
          boxShadow: env===e ? '0 2px 12px 0 rgba(200,144,255,0.15)' : undefined,
          fontFamily: 'inherit'
        }}
      >
        {e.toUpperCase()}
      </button>
    ))}
  </div>
);
