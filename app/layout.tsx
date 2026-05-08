import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solana Multi-Wallet Dashboard',
  description: 'Professional trading dashboard for coordinated Solana wallet management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-solana-darker text-white">
        {children}
      </body>
    </html>
  )
}
