export const Filters=({label,value,opts,onChange}:{label:string,value:string,opts:string[],onChange:(v:string)=>void})=>(
  <label className="flex items-center gap-1 text-sm">
    {label}:
    <select value={value} onChange={e=>onChange(e.target.value)}
      className="bg-black border border-lightPurple rounded px-3 py-1">
      {opts.map(o=><option key={o} value={o}>{o.toUpperCase()}</option>)}
    </select>
  </label>
);
