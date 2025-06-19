import { ASSETS } from '../config/assets';
import { CHAINS } from '../config/chains';
import { priceAndLogo } from './coingecko';
import type { Row, Destination } from '../types';

const API_EXPLORER ='https://explorer-mainnet.aws.peersyst.tech/api/v2/tokens';

async function xrplevmSupply(addr:string){
  try {
    const res = await fetch(`${API_EXPLORER}/${addr}`);
    if (!res.ok) {
      if (res.status === 404) return '0';
      throw new Error(`HTTP ${res.status}`);
    }
    const j = await res.json();
    return j.total_supply ?? '0';
  } catch (e) {
    console.error('xrplevmSupply error', addr, e);
    return '0';
  }
}

async function cosmosSupply(endpoint:string,denom:string){
  try {
    const url=`${endpoint}/cosmos/bank/v1beta1/supply/by_denom?denom=${encodeURIComponent(denom)}`;
    const j=await fetch(url).then(r=>r.json());
    return j.amount?.amount ?? '0';
  } catch (e) {
    console.error('cosmosSupply error', endpoint, denom, e);
    return '0';
  }
}

export async function loadRows():Promise<Row[]> {
  try {
    /* 1) ERC-20 + IBC assets on XRPL EVM */
    const erc=await Promise.all(ASSETS.map(async a=>{
      let raw = '0';
      let usd = 0, logo = '';
      try {
        raw=await xrplevmSupply(a.address!);
        ({usd,logo}=await priceAndLogo(a.cg));
      } catch (e) {
        console.error('Asset row error', a, e);
      }
      const q=Number(raw)/10**a.decimals;
      return {
        ...a,
        logo,
        chainLogo:'/chains/xrpl-evm.svg',
        quantity:q,
        valueUsd:q*usd,
      } as Row;
    }));

    /* 2) XRP sitting on Cosmos chains – treat as extra rows */
    let xrpUsd = 0, xrpLogo = '';
    try {
      ({usd:xrpUsd,logo:xrpLogo}=await priceAndLogo('ripple'));
    } catch (e) {
      console.error('Coingecko XRP error', e);
    }
    const xrpRows=await Promise.all(CHAINS.map(async c=>{
      let raw = '0';
      try {
        raw=await cosmosSupply(c.endpoint,c.denom);
      } catch (e) {
        console.error('Cosmos XRP row error', c, e);
      }
      const q=Number(raw)/10**18;
      return {
        key:`xrp-${c.key}`,
        symbol:'XRP',
        decimals:18,
        source:'XRPL EVM',
        dest: c.name as Destination,
        denom:c.denom,
        cg:'ripple',
        logo:xrpLogo,
        chainLogo:c.logo,
        quantity:q,
        valueUsd:q*xrpUsd,
      } as Row;
    }));

    return [...erc,...xrpRows];
  } catch (e) {
    console.error('loadRows fatal error', e);
    return [];
  }
}
