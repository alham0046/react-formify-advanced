import { createContext, useContext, type CSSProperties } from "react";

interface DropdownStyleContextType {
  twHighlightedStyles?: string; // Use your DropdownStyleProp2 type here
  highlightedStyle?: CSSProperties;   // Use your InputStyle type here
  // name : string
}

export const DropdownContext = createContext<DropdownStyleContextType>({ twHighlightedStyles: '', highlightedStyle: {} });

export const useDropdownContext = () => {
  return useContext(DropdownContext)
}
// import { createContext, useContext } from "react";
// import type { DropdownStyleProp, TWDropdownStyleProp } from "../typeDeclaration/stylesProps";
// import type { InputStyle } from "../components/InputTemplate";

// interface DropdownStyleContextType {
//   twStyle: Partial<TWDropdownStyleProp>; // Use your DropdownStyleProp2 type here
//   style: Partial<InputStyle & DropdownStyleProp>;   // Use your InputStyle type here
//   name : string
// }

// export const DropdownContext = createContext<DropdownStyleContextType>({ twStyle: {}, style: {}, name: '' });

// export const useDropdownContext = () => {
//   return useContext(DropdownContext)
// }