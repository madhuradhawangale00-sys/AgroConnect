"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className }) => (
  <aside className={cn("w-64 bg-gray-900 text-white h-full", className)}>
    {children}
  </aside>
);

const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex">{children}</div>
);

const SidebarTrigger: React.FC<{ onClick?: () => void; className?: string }> = ({
  onClick,
  className,
}) => (
  <button
    className={cn("p-4 text-gray-200 hover:bg-gray-800", className)}
    onClick={onClick}
  >
    Toggle Sidebar
  </button>
);

const SidebarContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-4">{children}</div>
);

const SidebarHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-4 border-b border-gray-700 ${className || ''}`}>{children}</div>
);

const SidebarGroup: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mt-4">{children}</div>
);

const SidebarGroupLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="text-gray-400 uppercase text-sm px-4">{children}</div>
);

const SidebarGroupContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mt-2 space-y-2">{children}</div>
);

const SidebarMenu: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ul className="space-y-2">{children}</ul>
);

const SidebarMenuButton: React.FC<{
  children: ReactNode;
  className?: string;
  isActive?: boolean;
}> = ({ children, className, isActive }) => (
  <li>
    <button
      className={cn(
        "block w-full text-left px-4 py-2 rounded hover:bg-gray-800",
        isActive ? "bg-gray-700" : "",
        className
      )}
    >
      {children}
    </button>
  </li>
);

const SidebarMenuItem: React.FC<{ children: ReactNode }> = ({ children }) => (
  <li>{children}</li>
);

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
};
