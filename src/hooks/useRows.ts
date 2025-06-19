import { useEffect,useState } from 'react';
import { loadRows } from '../services/tvl';
import type { Row } from '../types';

export function useRows(){
  const [rows,set]=useState<Row[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ loadRows().then(r=>{set(r);setLoading(false);}); },[]);
  const total=rows.reduce((s,r)=>s+r.valueUsd,0);
  return {rows,total,loading};
}
