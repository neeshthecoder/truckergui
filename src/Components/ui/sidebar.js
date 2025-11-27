import React from 'react';
export function Sidebar({ children, className = '', ...rest }) { return <aside className={`${className}`} {...rest}>{children}</aside>; }
export function SidebarContent({ children }) { return <div>{children}</div>; }
export function SidebarGroup({ children }) { return <div>{children}</div>; }
export function SidebarGroupContent({ children }) { return <div>{children}</div>; }
export function SidebarGroupLabel({ children }) { return <div>{children}</div>; }
export function SidebarMenu({ children }) { return <ul>{children}</ul>; }
export function SidebarMenuButton({ children, asChild }) { if (asChild) return <li>{children}</li>; return <button>{children}</button>; }
export function SidebarMenuItem({ children }) { return <li>{children}</li>; }
export function SidebarHeader({ children }) { return <div>{children}</div>; }
export function SidebarFooter({ children }) { return <div>{children}</div>; }
export function SidebarProvider({ children }) { return <div>{children}</div>; }
export function SidebarTrigger({ children }) { return <button>{children || '☰'}</button>; }
export default Sidebar;
