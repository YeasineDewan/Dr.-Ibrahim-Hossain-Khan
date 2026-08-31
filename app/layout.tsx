import type { Metadata, Viewport } from 'next'
import '@heroui/react/dist/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dr. Ibrahim Clinic | Human healthcare in Accra',
  description: 'Thoughtful medical care, preventive medicine and personalised wellness from Dr. Ibrahim Clinic in Accra.',
  generator: 'Dr. Ibrahim Clinic',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8faf9',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className="antialiased">{children}</body></html>
}
