'use client';

import { usePathname } from 'next/navigation';
import { Sidebar, SidebarInset, SidebarProvider } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Toaster } from './ui/toaster';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Pages that should not have the main app sidebar
  const noSidebarPaths = ['/', '/login'];
  
  const isNoSidebarPage = noSidebarPaths.includes(pathname);

  if (isNoSidebarPage) {
    // For auth and onboarding pages, render children directly without the main app layout.
    return (
        <>
            {children}
            <Toaster />
        </>
    );
  }
  
  // For timetable page, we want a different layout
  if (pathname.startsWith('/schedule')) {
     return (
        <>
            {children}
            <Toaster />
        </>
    );
  }


  // For all other pages, use the standard layout with the sidebar.
  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
