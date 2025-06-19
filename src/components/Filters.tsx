export const Filters = ({ label, value, opts, onChange }: { label: string, value: string, opts: string[], onChange: (v: string) => void }) => (
  <div className="flex flex-col items-start w-full max-w-[30vw] min-w-[140px]">
    <span className="mb-1 pl-1 text-left w-full font-medium">{label}:</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ borderColor: '#C890FF', backgroundColor: 'rgba(0,0,0,0.6)' }}
      className="border rounded px-3 py-1 focus:border-darkPurple focus:outline-none w-full"
    >
      {opts.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
    </select>
  </div>
);
