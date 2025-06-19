export const Avatar=({src,size=24}:{src:string,size?:number})=>(
  <img src={src} width={size} height={size} className="inline-block rounded-full mr-1 align-middle"/>
);
