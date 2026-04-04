// import { useNameScope } from "../context/NameScopeContext"
// import { camelCase } from "../functions/camelCase"

// export const useFieldName = (placeholder: string, name?: string) => {
//   const parent = useNameScope()
//   const local = name || camelCase(placeholder)
//   return parent ? `${parent}.${local}` : local
// }


import { InputStore } from "@/store/InputStore"
import { useNameScope } from "../context/NameScopeContext"
import { camelCase } from "../functions/camelCase"

export const useFieldName = (placeholder: string, name?: string, inputStore?: InputStore) => {
  const parent = useNameScope()
  const local = name || camelCase(placeholder)
  if (parent) {
    if (parent.parentType === "array") {
      inputStore?.setArrayObject(parent.parentKey, local)
    }
    return `${parent.parent}.${local}`
  }
  return local
}
