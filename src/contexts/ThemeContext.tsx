import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'bi2b-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ?? 'system'
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

function applyThemeToDOM(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme ?? getStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const initial = defaultTheme ?? getStoredTheme()
    const resolved = initial === 'system' ? getSystemTheme() : initial
    applyThemeToDOM(resolved)
    return resolved
  })

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    applyThemeToDOM(resolved)
    setResolvedTheme(resolved)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  // Ouvir alterações do tema do sistema
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light'
      applyThemeToDOM(resolved)
      setResolvedTheme(resolved)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme
    applyThemeToDOM(resolved)
    setResolvedTheme(resolved)
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    const nextResolved = resolvedTheme === 'dark' ? 'light' : 'dark'
    applyThemeToDOM(nextResolved)
    setResolvedTheme(nextResolved)
    setThemeState(nextResolved)
    localStorage.setItem(THEME_STORAGE_KEY, nextResolved)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
