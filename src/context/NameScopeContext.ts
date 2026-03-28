// NameScopeContext.ts
import { createContext, useContext } from "react";

export const NameScopeContext = createContext<string | null>(null);

export const useNameScope = () => useContext(NameScopeContext);
