import React from 'react';
export function Badge({ children, className = '', ...rest }) {
  return <span className={`${className}`} {...rest}>{children}</span>;
}
export default Badge;
