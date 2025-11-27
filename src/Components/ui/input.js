import React from 'react';
export function Input(props) {
  return <input className={`px-3 py-2 rounded bg-black border border-zinc-800 text-white ${props.className || ''}`} {...props} />;
}
export default Input;
