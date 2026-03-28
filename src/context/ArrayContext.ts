// ArrayContext.ts
import { createContext, useContext } from 'react'

interface ArrayContextValue {
  path: string
}

export const ArrayContext = createContext<ArrayContextValue | null>(null)

export const useArrayContext = () => {
  const ctx = useContext(ArrayContext)
  if (!ctx) {
    throw new Error('ArrayContainer.Add must be used inside ArrayContainer')
  }
  return ctx
}
