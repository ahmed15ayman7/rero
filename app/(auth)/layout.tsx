import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rero',
  description: 'Rero registration information in application',
  icons:'/logo.svg'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ClerkProvider>
    <html lang="en" >
      <body className={inter.className +' bg-dark-1'}>
        <div className=" min-h-screen flex w-full items-center justify-center">
        {children}
        </div>
        </body>
    </html>
      </ClerkProvider>
  )
}
