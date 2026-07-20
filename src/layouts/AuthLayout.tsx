import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="grid-pattern fixed inset-0 -z-10" />
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
