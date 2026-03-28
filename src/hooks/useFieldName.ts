import { useNameScope } from "../context/NameScopeContext"
import { camelCase } from "../functions/camelCase"

export const useFieldName = (placeholder: string, name?: string) => {
  const parent = useNameScope()
  const local = name || camelCase(placeholder)
  return parent ? `${parent}.${local}` : local
}
