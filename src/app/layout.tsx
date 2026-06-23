import type { Metadata } from 'next'
import { Figtree, Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AppSidebar } from '@/components/layout/sidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-heading' })
const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Revest Admin',
  description: 'Products and orders admin dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn('h-full antialiased', inter.variable, figtree.variable)}
    >
      <body className="flex min-h-full">
        <TooltipProvider delayDuration={300}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="bg-card flex h-14 items-center border-b px-5 md:hidden">
                <SidebarTrigger />
              </header>
              <main className="flex-1 p-8">
                <div className="mx-auto w-full max-w-350">{children}</div>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster theme="light" position="top-right" />
      </body>
    </html>
  )
}
