import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  AlertTriangle, 
  BarChart3,
  Brain,
  Sparkles
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "FLEET OVERVIEW",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "DRIVERS",
    url: createPageUrl("Operators"),
    icon: Users,
  },
  {
    title: "ALERTS",
    url: createPageUrl("Alerts"),
    icon: AlertTriangle,
  },
  {
    title: "ANALYTICS",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "AI RECOMMENDATIONS",
    url: createPageUrl("AIRecommendations"),
    icon: Sparkles,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-[#0a0a0a]">
        <Sidebar className="border-r border-zinc-800 bg-zinc-900 text-zinc-100">
          <SidebarHeader className="border-b border-zinc-800 p-4 bg-zinc-900">
            <div className="flex items-center gap-3">
              <img 
                src="/images/axon-logo.png" // Updated path
                alt="Axon Labs"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="font-bold text-white text-lg tracking-tight">AXON TRANSPORT</h2>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mono">FLEET SAFETY SYSTEMS</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2 bg-zinc-900">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 py-3 mono">
                NAVIGATION
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-zinc-800 transition-all duration-200 rounded mb-1 border ${
                            isActive 
                              ? 'bg-zinc-800 text-cyan-400 border-cyan-400/30' 
                              : 'text-zinc-300 border-transparent hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className="w-4 h-4" />
                            <span className="text-xs font-semibold tracking-wide">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 py-3 mono">
                FLEET STATUS
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-xs border border-zinc-800 rounded p-2 bg-zinc-950">
                    <span className="text-zinc-400 uppercase tracking-wide mono">HEALTH</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-semibold mono">OPTIMAL</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs border border-zinc-800 rounded p-2 bg-zinc-950">
                    <span className="text-zinc-400 uppercase tracking-wide mono">ACTIVE DRIVERS</span>
                    <span className="font-bold text-white mono">0</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border border-zinc-800 rounded p-2 bg-zinc-950">
                    <span className="text-zinc-400 uppercase tracking-wide mono">ALERTS</span>
                    <span className="font-bold text-amber-400 mono">0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-zinc-800 p-4 bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-800 rounded flex items-center justify-center border border-zinc-700">
                <span className="text-zinc-300 font-bold text-sm mono">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm uppercase tracking-wide">ADMIN</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider mono">FLEET MANAGER</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
          <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-zinc-800 p-2 rounded transition-colors duration-200" />
              <h1 className="text-lg font-bold uppercase tracking-wide text-white">AXON TRANSPORT</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}