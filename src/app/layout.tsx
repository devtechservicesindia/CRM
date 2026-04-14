import type { Metadata } from 'next'
import { AppProvider } from '@/context/AppContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'GP CRM — The Neon Architect',
  description: 'Game Parlour Customer Relationship Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
