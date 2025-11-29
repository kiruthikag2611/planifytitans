
'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Calendar, List, Brain, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import Image from 'next/image';

export default function AppSidebar(): JSX.Element {
  const { user, status } = useUser();

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
      <div className="p-4">
          <h3 className="text-lg font-semibold">Planify</h3>
          <p className="text-xs text-muted-foreground">Plan smarter</p>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Home className="h-4 w-4" /> <span>Dashboard</span>
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <List className="h-4 w-4" /> <span>Tasks & Activities</span>
        </Link>
        <Link href="/calendar" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Calendar className="h-4 w-4" /> <span>Calendar</span>
        </Link>
        <Link href="/schedule" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Calendar className="h-4 w-4" /> <span>Timetable</span>
        </Link>
        <Link href="/tasks/exams" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Brain className="h-4 w-4" /> <span>Thinkathon</span>
        </Link>
        <Link href="/tools" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Settings className="h-4 w-4" /> <span>Tools</span>
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-sidebar/20">
        {status === 'loading' ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : user ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName ?? 'Avatar'} width={32} height={32} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  {user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium truncate">{user.displayName ?? 'User'}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email ?? ''}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleSignOut}>Sign out</Button>
          </div>
        ) : (
          <div>
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
