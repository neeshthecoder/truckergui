import React from 'react';

export function Card({ children, className = '', ...rest }) {
  return (
    <div className={`${className}`} {...rest}>{children}</div>
  );
}

export function CardHeader({ children, className = '', ...rest }) {
  return <div className={`p-4 border-b ${className}`} {...rest}>{children}</div>;
}

export function CardContent({ children, className = '', ...rest }) {
  return <div className={`p-4 ${className}`} {...rest}>{children}</div>;
}

export function CardTitle({ children, className = '', ...rest }) {
  return <div className={`text-sm font-semibold ${className}`} {...rest}>{children}</div>;
}

export function CardFooter({ children, className = '', ...rest }) {
  return <div className={`p-4 border-t ${className}`} {...rest}>{children}</div>;
}

export default Card;
