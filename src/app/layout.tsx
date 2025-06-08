import type { Metadata } from 'next'
import { Inter, Alegreya, Belleza } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })
const alegreya = Alegreya({ subsets: ['latin'], variable: '--font-body' })
const belleza = Belleza({ weight: '400', subsets: ['latin'], variable: '--font-headline' })

export const metadata: Metadata = {
  title: 'Wearable 2.0',
  description: 'Your personal AI powered wardrobe assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} ${alegreya.variable} ${belleza.variable}`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  )
}