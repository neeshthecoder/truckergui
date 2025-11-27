import React from 'react';
export function Progress({ value = 0, className = '', ...rest }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`w-full bg-zinc-900 rounded ${className}`} {...rest}>
      <div style={{ width: `${pct}%` }} className="bg-cyan-500 h-2 rounded" />
    </div>
  );
}
export default Progress;
