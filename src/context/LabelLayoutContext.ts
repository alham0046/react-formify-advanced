import { createContext, useContext } from "react"

type LabelMode = boolean
// type LabelMode = "floating" | "row"

interface FormLayoutContextValue {
  labelMode: LabelMode
}

export const FormLayoutContext = createContext<FormLayoutContextValue>({labelMode : false})

// export const useFormLayout = () => {
//     const ctx = useContext(FormLayoutContext)
//       if (!ctx) {
//         throw new Error('ArrayContainer.Add must be used inside ArrayContainer')
//       }
//       return ctx
// }
export const useFormLayout = () => useContext(FormLayoutContext)
