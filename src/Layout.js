import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
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
} from "./Components/ui/sidebar";
import { Badge } from "./Components/ui/badge";

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
        <Sidebar className="w-72 min-h-screen flex-shrink-0 border-r border-zinc-800 bg-[#0F0F12] text-zinc-100 flex flex-col">
          <SidebarHeader className="p-6 bg-[#0F0F12]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-zinc-900 flex items-center justify-center">
                <img
                  src="/images/axon-logo.png"
                  alt="Axon Labs"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="leading-tight">
                <h2 className="font-bold text-white text-lg tracking-tight uppercase">AXON TRANSPORT</h2>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mono mt-0.5 font-light">FLEET SAFETY SYSTEMS</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-6 pt-10 pb-6 bg-[#0F0F12]">
            {/* divider sits immediately below the header with 20 extra gap */}
            <div className="border-t border-zinc-800" />
            {/* NAVIGATION GROUP - spacing moved down and aligned with icons */}
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-8 pr-0 py-2 mono mb-6">
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
                          className={`transition-all duration-200 mb-6 w-full rounded-md`}
                        >
                          <Link 
                            to={item.url} 
                            className={`flex items-center gap-3 pl-6 pr-4 py-3 w-full ${
                              isActive 
                                ? 'text-cyan-400' 
                                : 'text-zinc-300 hover:text-zinc-100'
                            }`}
                          >
                            <item.icon className={`${isActive ? 'text-cyan-400' : 'text-zinc-400'} w-5 h-5 flex-shrink-0`} />
                            <span className={`flex-1 text-[13px] font-medium leading-none tracking-normal ${isActive ? 'text-cyan-400' : 'text-zinc-300'}`}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* FLEET STATUS */}
            <SidebarGroup className="mt-12">
              <SidebarGroupLabel className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide px-0 py-2 mono mb-3">
                FLEET STATUS
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs rounded-lg bg-[#0d0d0f] px-4 py-3">
                    <span className="text-zinc-400 uppercase tracking-wide mono">HEALTH</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#00ff66] rounded-full" />
                      <span className="text-[#00ff66] font-semibold mono">OPTIMAL</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs rounded-lg bg-[#0d0d0f] px-4 py-3">
                    <span className="text-zinc-400 uppercase tracking-wide mono">ACTIVE DRIVERS</span>
                    <span className="font-semibold text-white mono">0</span>
                  </div>

                  <div className="flex items-center justify-between text-xs rounded-lg bg-[#0d0d0f] px-4 py-3">
                    <span className="text-zinc-400 uppercase tracking-wide mono">ALERTS</span>
                    <span className="font-semibold text-[#FFB020] mono">0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="mt-auto border-t border-zinc-800 bg-[#0d0d0f] p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center border border-zinc-700">
                <span className="text-zinc-300 font-bold text-sm mono">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm uppercase tracking-wide">ADMIN</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mono">FLEET MANAGER</p>
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