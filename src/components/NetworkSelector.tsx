import React from 'react';

interface Props {
  env: 'testnet' | 'mainnet';
  onChange: (env: 'testnet'|'mainnet') => void;
}

export const NetworkSelector: React.FC<Props> = ({ env, onChange }) => (
  <div className="flex space-x-4 p-4">
    {(['testnet','mainnet'] as const).map(e => (
      <button
        key={e}
        onClick={() => onChange(e)}
        className={`px-4 py-2 rounded-full font-semibold
          ${env===e
            ? 'bg-lightPurple text-white shadow-lg'
            : 'bg-white text-darkPurple border border-darkPurple'
          }`}
      >
        {e.toUpperCase()}
      </button>
    ))}
  </div>
);
