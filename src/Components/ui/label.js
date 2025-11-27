import React from 'react';
export function Label({ children, className = '', ...rest }) {
  return <label className={`${className}`} {...rest}>{children}</label>;
}
export default Label;
