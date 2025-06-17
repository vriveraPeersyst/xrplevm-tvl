import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import './App.css'

export default function App() {
  const [env, setEnv] = useState<'testnet'|'mainnet'>('testnet');
  return (
    <div className="min-h-screen bg-black font-work">
      <header className="bg-darkPurple text-white p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight">XRP Supply Monitor</h1>
      </header>
      <Dashboard env={env} onEnvChange={setEnv} />
    </div>
  );
}
