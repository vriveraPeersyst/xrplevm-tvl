import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import BrandLines from "./components/BrandLines";

import './App.css'

export default function App() {
  const [env, setEnv] = useState<'testnet'|'mainnet'>('testnet');
  return (
    <div className="min-h-screen bg-black font-work">
      <BrandLines />
      <header className="bg-darkPurple text-white p-6 flex flex-col items-center">
        <img
          src="/src/assets/XRPLEVM_FullWhiteLogo.png"
          alt="XRPL EVM Logo"
          className="mx-auto h-12 md:h-16"
          style={{ objectFit: 'contain' }}
        />
      </header>
      <Dashboard env={env} onEnvChange={setEnv} />
    </div>
  );
}
