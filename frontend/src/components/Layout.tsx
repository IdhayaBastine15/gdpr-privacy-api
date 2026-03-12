import { ReactNode } from 'react'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
