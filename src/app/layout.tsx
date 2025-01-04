import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from './context/UserContext';
import { SidebarProvider } from '@/components/ui/sidebar';

import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Maffi Store Panel',
  description: 'Shop the latest products at great prices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <SidebarProvider>
              <div className="min-h-screen w-full overflow-hidden flex relative">
                <AppSidebar />
                <main className="flex-1 relative bg-background overflow-auto p-6">
                  {children}
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

