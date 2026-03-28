// resolveTwStyles.ts

import { mergeClasses } from "./mergeClasses"


type ResolveParams<T> = {
  defaultStyles?: Partial<T>
  sharedStyles?: Partial<T>
  localStyles?: Partial<T>
}

/**
 * Merges Tailwind style layers in correct priority order:
 *
 * default < shared < local
 *
 * Uses mergeClasses to ensure safe Tailwind overrides.
 */
export function resolveTwStyles<T extends Record<string, any>>({
  defaultStyles = {},
  sharedStyles = {},
  localStyles = {},
}: ResolveParams<T>): T {
  const result: Record<string, any> = {}

  const keys = new Set([
    ...Object.keys(defaultStyles),
    ...Object.keys(sharedStyles),
    ...Object.keys(localStyles),
  ])

  keys.forEach((key) => {
    const base = defaultStyles[key]
    const shared = sharedStyles[key]
    const local = localStyles[key]

    // Only merge if values are strings (Tailwind classes)
    if (
      typeof base === "string" ||
      typeof shared === "string" ||
      typeof local === "string"
    ) {
      result[key] = mergeClasses(
        mergeClasses(base, shared),
        local
      )
    } else {
      // For non-string values (numbers, objects, etc.)
      result[key] = local ?? shared ?? base
    }
  })

  return result as T
}
