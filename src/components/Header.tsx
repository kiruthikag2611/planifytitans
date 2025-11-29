
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import { SidebarTrigger } from './ui/sidebar';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header(): JSX.Element {
  const { user, status } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  // Only show back button if on a client and not on the dashboard page
  const showBackButton = isClient && pathname !== '/dashboard';

  return (
    <header className="w-full border-b bg-background/60 backdrop-blur-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">Planify</h1>
          <p className="text-xs text-muted-foreground -mt-1">
            Smarter Schedule, Smoother Days
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-3">
        {status === 'loading' ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
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
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-medium text-sm">{user.displayName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>

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
    </header>
  );
}
