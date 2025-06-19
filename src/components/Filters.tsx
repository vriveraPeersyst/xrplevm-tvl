export const Filters=({label,value,opts,onChange}:{label:string,value:string,opts:string[],onChange:(v:string)=>void})=>(
  <label className="flex items-center gap-1 text-sm">
    {label}:
    <select
      value={value}
      onChange={e=>onChange(e.target.value)}
      style={{ borderColor: '#C890FF', backgroundColor: 'rgba(0,0,0,0.6)' }}
      className="border rounded px-3 py-1 focus:border-darkPurple focus:outline-none"
    >
      {opts.map(o=><option key={o} value={o}>{o.toUpperCase()}</option>)}
    </select>
  </label>
);
