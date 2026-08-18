"use client"

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import {LayoutDashboard, FileCodeIcon as FileContract, Cloud, Sprout, Award, Truck } from 'lucide-react';
import Header from '@/components/layout/header';  
import Footer from '@/components/Footer';

const navItems = [
  { href: '/fdashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fdashboard/contracts', label: 'My Contracts', icon: FileContract },
  { href: '/fdashboard/weather', label: 'Weather Information', icon: Cloud },
  { href: '/fdashboard/crop-help', label: 'Crop Help', icon: Sprout },
  { href: '/fdashboard/benefits', label: 'Contract Benefits', icon: Award },
  { href: '/fdashboard/services', label: '3rd Party Services', icon: Truck },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getActiveClass = (href: string) => {
    return pathname === href ? 'bg-primary font-bold text-white' : '';
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar className="hidden md:block bg-background/80 backdrop-blur-sm">
            <SidebarHeader>
              <Link href="/" className="flex items-center space-x-2 px-4 py-2">
                <span className="text-2xl font-bold">KisanMitra</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton className={getActiveClass(item.href)}>
                          <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center justify-between border-b px-4">
              <SidebarTrigger className="md:hidden" />
              
            </header>
            <main className="flex-1 overflow-auto p-4 bg-background/80 backdrop-blur-sm">
              <div className="mx-auto max-w-4xl">{children}</div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
