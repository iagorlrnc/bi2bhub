import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

interface LandingLayoutProps {
  children?: ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {children || <Outlet />}
    </div>
  )
}
