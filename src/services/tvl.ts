import { ASSETS } from '../config/assets';
import { CHAINS } from '../config/chains';
import { getPrice } from './priceService';
import type { Row, Destination } from '../types';

const API_EXPLORER ='https://explorer-mainnet.aws.peersyst.tech/api/v2/tokens';

async function peersystSupply(addr:string){
  const j=await fetch(`${API_EXPLORER}/${addr}`).then(r=>r.json());
  return j.total_supply ?? '0';
}

async function cosmosSupply(endpoint:string,denom:string){
  const url=`${endpoint}/cosmos/bank/v1beta1/supply/by_denom?denom=${encodeURIComponent(denom)}`;
  const j=await fetch(url).then(r=>r.json());
  return j.amount?.amount ?? '0';
}

export async function loadRows():Promise<Row[]> {
  /* 1) ERC-20 + IBC assets on XRPL EVM */
  const erc = await Promise.all(ASSETS.map(async a => {
    const raw = await peersystSupply(a.address!);
    const usd = await getPrice({ cg: a.cg, cmc: a.cmc, binance: a.binance });
    const q = Number(raw) / 10 ** a.decimals;
    return {
      ...a,
      logo: `/src/assets/tokens/${a.image}`,
      chainLogo: '/chains/xrpl-evm.svg',
      quantity: q,
      valueUsd: q * usd,
    } as Row;
  }));

  /* 2) XRP sitting on Cosmos chains – treat as extra rows */
  const xrpUsd = await getPrice({ cg: 'ripple', cmc: 'ripple', binance: 'XRPUSDT' });
  const xrpRows = await Promise.all(CHAINS.map(async c => {
    const raw = await cosmosSupply(c.endpoint, c.denom);
    const q = Number(raw) / 10 ** 18;
    return {
      key: `xrp-${c.key}`,
      symbol: 'XRP',
      decimals: 18,
      source: 'XRPL',
      dest: c.name as Destination,
      denom: c.denom,
      cg: 'ripple',
      cmc: 'ripple',
      binance: 'XRPUSDT',
      logo: '/src/assets/tokens/xrp.png',
      chainLogo: c.logo,
      quantity: q,
      valueUsd: q * xrpUsd,
    } as Row;
  }));

  return [...erc, ...xrpRows];
}
