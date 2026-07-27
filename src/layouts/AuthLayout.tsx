import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

interface AuthLayoutProps {
  children?: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] px-4 py-8">
      <div className="grid-pattern fixed inset-0 -z-10" />
      <div className="w-full max-w-md">
        {children || <Outlet />}
      </div>
    </div>
  )
}
