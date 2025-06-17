import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sam-YUVA-REC',
  description: 'Yi-Yuva-REC Abraham Samuel Manifesto',
  // generator: 'sam',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}
