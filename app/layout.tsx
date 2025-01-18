"use client"
import {usePathname} from 'next/navigation'
import { cookies } from "next/headers";  //This is for keeping the sidebar persisted
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import localFont from "next/font/local";
import "./globals.css";
import { SourcesProvider } from "@/context/SourcesContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/nextjs'
import { SignIn } from "@clerk/nextjs";

import CustomSignIn from "@/app/components/CustomSignIn";

import {useTheme} from 'next-themes'

//async function to keep server persisted during loaded
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up" || pathname.includes("/sign-up/");
    //The bottom two lines are for keeping sidebar persisted on reloads
  return (
   <ClerkProvider>
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange> 
        <SignedIn>
          <SidebarProvider>
            <SourcesProvider>
            <div className="flex h-screen w-full overflow-hidden">
            <AppSidebar />
              <main className="flex-1 flex flex-col overflow-hidden">
              <SidebarTrigger />
              {children}
              </main></div>
            </SourcesProvider>
          </SidebarProvider>
          </SignedIn> 
          {<SignedOut>
                 {isSignUp ? (
                   // Let the /sign-up page show when signed out
                   children
                 ) : (
                   // Otherwise show sign in
                   <CustomSignIn />
                 )}
          </SignedOut> }
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}

  