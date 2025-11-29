
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';

export default function Header(): JSX.Element {
  const { user, status } = useUser();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  return (
    <header className="w-full border-b bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4 md:p-6">
        
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold">Planify</span>
            <span className="text-xs text-muted-foreground -mt-1">
              Smarter Schedule, Smoother Days
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/tasks" className="hidden md:inline-block">
            <Button variant="ghost" size="sm">Tasks</Button>
          </Link>

          <Link href="/calendar" className="hidden md:inline-block">
            <Button variant="ghost" size="sm">Calendar</Button>
          </Link>

          {status === 'loading' ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full overflow-hidden bg-muted">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName ?? 'Avatar'}
                      width={36}
                      height={36}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      {user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>
              </Link>

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
