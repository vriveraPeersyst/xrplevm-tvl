import React from 'react';
import { CHAINS } from '../config/chains';
import { useTotalSupply } from '../hooks/useTotalSupply';
import { SupplyCard } from './SupplyCard';
import type { Env } from '../types';

interface Props { env: Env; }

export const Dashboard: React.FC<Props> = ({ env }) => {
  const { data } = useTotalSupply(env, CHAINS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {CHAINS.map((chain) => (
        <SupplyCard
          key={chain.key}
          chainName={chain.displayName}
          amount={data[chain.key]?.amount || null}
          error={data[chain.key]?.error}
        />
      ))}
    </div>
  );
};
