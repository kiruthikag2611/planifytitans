
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { SidebarTrigger } from './ui/sidebar';
import { ArrowLeft, Edit, KeyRound, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import { doc, getDoc } from 'firebase/firestore';

type UserProfile = {
  answers?: Record<string, any>;
  [key: string]: any;
};

export default function Header(): JSX.Element {
  const { user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { data: userProfile } = useDoc<UserProfile>(
    user && firestore ? `users/${user.uid}` : null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showBackButton = isClient && pathname !== '/dashboard';

  const handlePasswordChange = () => {
    // In a real app, this would trigger a password reset flow.
    // For now, we can just log it or show a toast.
    alert('A password reset link would be sent in a real application.');
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-1 rounded-full">
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
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <span>View My Answers</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                    <DropdownMenuLabel>Questionnaire Responses</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userProfile?.answers ? (
                       Object.entries(userProfile.answers).map(([key, value]) => (
                        <DropdownMenuItem key={key} className="flex flex-col items-start gap-1">
                          <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-sm">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem>No answers found.</DropdownMenuItem>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
               <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/tools/settings">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePasswordChange}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button size="sm">Sign in</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
