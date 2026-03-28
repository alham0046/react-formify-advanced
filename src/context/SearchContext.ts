import { createContext, useContext } from 'react'

export const SearchRefContext =
  createContext<React.RefObject<HTMLInputElement> | null>(null)

export const useInputRef = () => useContext(SearchRefContext)