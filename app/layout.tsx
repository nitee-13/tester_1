
import { cookies } from "next/headers";  //This is for keeping the sidebar persisted
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import localFont from "next/font/local";
import "./globals.css";
import { SourcesProvider } from "@/context/SourcesContext";
import { ThemeProvider } from "@/components/theme-provider";

//async function to keep server persisted during loaded
export default function Layout({ children }: { children: React.ReactNode }) {
    //The bottom two lines are for keeping sidebar persisted on reloads

  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange>
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
        </ThemeProvider>
      </body>
    </html>
  )
}

  