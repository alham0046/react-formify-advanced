// // NameScopeContext.ts
// import { createContext, useContext } from "react";

// export const NameScopeContext = createContext<string | null>(null);

// export const useNameScope = () => useContext(NameScopeContext);


import { createContext, useContext } from "react";

interface NameScopeContextProps {
    parent: string;
    parentIndex?: number
    parentKey : string
    parentType : string
}

// export const NameScopeContext = createContext<string | null>(null);
export const NameScopeContext = createContext<NameScopeContextProps | null>(null);

export const useNameScope = () => useContext(NameScopeContext);