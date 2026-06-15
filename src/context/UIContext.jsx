import { createContext, useCallback, useContext, useRef, useState } from 'react'

const UIContext = createContext(null)

let idCounter = 0

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const timers = useRef({})

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    (message, { type = 'info', duration = 1500 } = {}) => {
      const id = ++idCounter
      setToasts((current) => [...current, { id, message, type }])
      timers.current[id] = setTimeout(() => dismissToast(id), duration)
      return id
    },
    [dismissToast]
  )

  const toggleMobileNav = useCallback(() => setMobileNavOpen((open) => !open), [])
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  const value = {
    toasts,
    showToast,
    dismissToast,
    mobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within a UIProvider')
  return ctx
}
