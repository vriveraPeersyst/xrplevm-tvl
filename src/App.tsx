import BrandLines from "./components/BrandLines";
import Dashboard from './components/Dashboard';

import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <BrandLines />
      <header className="text-white p-6 flex flex-col items-center">
        <img
          src="/assets/XRPLEVM_FullWhiteLogo.png"
          alt="XRPL EVM Logo"
          className="mx-auto h-12 md:h-16"
          style={{ objectFit: 'contain' }}
        />
      </header>
      <Dashboard/>
    </div>
  );
}
