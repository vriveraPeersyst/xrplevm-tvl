const cache=new Map<string,{usd:number,logo:string}>();

export async function priceAndLogo(id:string){
  if(cache.has(id)) return cache.get(id)!;
  const [p,l]=await Promise.all([
    fetch(`/api/coingecko/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
      .then(r=>r.json()).then(j=>j[id].usd as number),
    fetch(`/api/coingecko/api/v3/coins/${id}`)
      .then(r=>r.json()).then(j=>j.image.small as string)
  ]);
  const v={usd:p,logo:l}; cache.set(id,v); return v;
}
