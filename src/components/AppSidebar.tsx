
'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Calendar, List, Brain, Settings, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import Image from 'next/image';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';

export default function AppSidebar(): JSX.Element {
  const { user, status } = useUser();
  const { state } = useSidebar();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out failed', err);
    }
  };

  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold">Planify</h3>
          {state === 'expanded' && <p className="text-xs text-muted-foreground">Plan smarter</p>}
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard"><Home /><span>Dashboard</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tasks & Activities">
                    <Link href="/tasks"><List /><span>Tasks & Activities</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Calendar">
                    <Link href="/calendar"><Calendar /><span>Calendar</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Timetable">
                    <Link href="/schedule"><Calendar /><span>Timetable</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Thinkathon">
                    <Link href="/tasks/exams"><Brain /><span>Thinkathon</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tools">
                    <Link href="/tools"><Settings /><span>Tools</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </nav>

      <div className="mt-auto p-2 border-t border-sidebar/20">
        {status === 'loading' ? (
          <div className="text-sm text-muted-foreground p-2">Loading...</div>
        ) : user ? (
          <div className="space-y-2 p-2">
            <Button variant="ghost" className="w-full justify-center" onClick={handleSignOut}>
                <Power className="mr-2 h-4 w-4" />
                {state === 'expanded' && <span>Logout</span>}
            </Button>
          </div>
        ) : (
          <div className="p-2">
            <Link href="/login">
              <Button size="sm" className="w-full">Sign in</Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
