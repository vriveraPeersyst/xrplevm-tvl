import { ASSETS } from '../config/assets';
import { CHAINS } from '../config/chains';
import { priceAndLogo } from './coingecko';
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

export async function loadRows():Promise<Row[]>{
  /* 1) ERC-20 + IBC assets on XRPL EVM */
  const erc=await Promise.all(ASSETS.map(async a=>{
    const raw=await peersystSupply(a.address!);
    const {usd}=await priceAndLogo(a.cg); // Only get price, ignore logo
    const q=Number(raw)/10**a.decimals;
    return {
      ...a,
      logo: `/src/assets/tokens/${a.image}`,
      chainLogo:'/chains/xrpl-evm.svg',
      quantity:q,
      valueUsd:q*usd,
    } as Row;
  }));

  /* 2) XRP sitting on Cosmos chains – treat as extra rows */
  const {usd:xrpUsd}=await priceAndLogo('ripple'); // Only get price, ignore logo
  const xrpRows=await Promise.all(CHAINS.map(async c=>{
    const raw=await cosmosSupply(c.endpoint,c.denom);
    const q=Number(raw)/10**18;
    return {
      key:`xrp-${c.key}`,
      symbol:'XRP',
      decimals:18,
      source:'XRPL',
      dest: c.name as Destination,
      denom:c.denom,
      cg:'ripple',
      logo: '/src/assets/tokens/xrp.png',
      chainLogo:c.logo,
      quantity:q,
      valueUsd:q*xrpUsd,
    } as Row;
  }));

  return [...erc,...xrpRows];
}
