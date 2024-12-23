import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from 'next/font/google'

import "@/app/globals.css"
import { ThemeProvider } from "next-themes"


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: "Maffi Store Panel",
  description: "Shop the latest products at great prices",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > 

          <main className="min-h-screen">
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  )
}

