// import { createContext, useContext } from "react";
// import type { InputStyle } from "../components/InputTemplate";
// import type { DropdownStyleProp, TWDropdownStyleProp, TWInputStyleProp } from "../typeDeclaration/stylesProps";
// import type { InputStore } from "../store/InputStore";

// interface ContainerContextProps {
//   sharedStyles: Partial<InputStyle>
//   sharedDropdownStyles: Partial<InputStyle & DropdownStyleProp>
//   sharedTw: Partial<TWInputStyleProp>
//   sharedDropdownTw: Partial<TWInputStyleProp & TWDropdownStyleProp>
//   inputStore?: InputStore
//   modalContainerRef?: React.RefObject<HTMLDivElement>
// }

// export const ContainerContext = createContext<ContainerContextProps>({ sharedStyles: {}, sharedDropdownStyles: {}, sharedDropdownTw: {}, sharedTw: {},inputStore: undefined, modalContainerRef: undefined });

// export const useContainerContext = () => {
//   return useContext(ContainerContext)
// }

import { createContext, useContext } from "react"
import type { InputStyle } from "../components/InputTemplate"
import type {
  DropdownStyleProp,
  TWDropdownStyleProp,
  TWInputStyleProp
} from "../typeDeclaration/stylesProps"
import type { InputStore } from "../store/InputStore"

interface ContainerContextProps {
  sharedStyles: Partial<InputStyle>
  sharedDropdownStyles: Partial<InputStyle & DropdownStyleProp>
  sharedTw: Partial<TWInputStyleProp>
  sharedDropdownTw: Partial<TWInputStyleProp & TWDropdownStyleProp>
  inputStore: InputStore
  modalContainerRef?: React.RefObject<HTMLDivElement>
}

// 👇 context can be undefined initially
export const ContainerContext =
  createContext<ContainerContextProps | undefined>(undefined)

export const useContainerContext = () => {
  const context = useContext(ContainerContext)

  if (!context) {
    throw new Error(
      "useContainerContext must be used inside an InputContainer"
    )
  }

  return context
}