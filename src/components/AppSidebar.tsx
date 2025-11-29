
'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Calendar, List, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';

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
    <aside className="w-64 border-r bg-muted/60 p-4">
      <div className="mb-6 flex items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Planify</h3>
          <p className="text-xs text-muted-foreground">Plan smarter</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Home className="h-4 w-4" /> <span>Dashboard</span>
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <List className="h-4 w-4" /> <span>Tasks</span>
        </Link>
        <Link href="/calendar" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Calendar className="h-4 w-4" /> <span>Calendar</span>
        </Link>
        <Link href="/schedule" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Calendar className="h-4 w-4" /> <span>Timetable</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <User className="h-4 w-4" /> <span>Profile</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 p-2 rounded hover:bg-accent/30">
          <Settings className="h-4 w-4" /> <span>Settings</span>
        </Link>
      </nav>

      <div className="mt-6">
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
              <div className="text-sm">{user.displayName ?? 'User'}</div>
              <div className="text-xs text-muted-foreground">{user.email ?? ''}</div>
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
