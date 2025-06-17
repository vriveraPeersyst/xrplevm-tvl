import React, { useState } from 'react';
import { NetworkSelector } from './components/NetworkSelector';
import { Dashboard }       from './components/Dashboard';
import './App.css'

export default function App() {
  const [env, setEnv] = useState<'testnet'|'mainnet'>('testnet');
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-darkPurple text-white p-4">
        <h1 className="text-2xl font-bold">XRP Supply Monitor</h1>
      </header>
      <NetworkSelector env={env} onChange={setEnv} />
      <Dashboard env={env} />
    </div>
  );
}
