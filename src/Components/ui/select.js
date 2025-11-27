import React from 'react';
export function Select({ children, className = '', ...rest }) {
  return <select className={`${className}`} {...rest}>{children}</select>;
}
export function SelectContent({ children }) { return <div>{children}</div>; }
export function SelectItem({ children, value }) { return <option value={value}>{children}</option>; }
export function SelectTrigger({ children }) { return <button>{children}</button>; }
export function SelectValue({ children }) { return <span>{children}</span>; }
export default Select;
