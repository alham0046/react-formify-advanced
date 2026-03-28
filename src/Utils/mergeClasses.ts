// classMerge.ts

/**
 * Lightweight Tailwind-aware class merger.
 *
 * Rules:
 * - Default classes applied first
 * - User classes override same utility group
 * - Different utility groups preserved
 * - No external dependencies
 */
export function mergeClasses(
  defaultClasses?: string,
  userClasses?: string
): string {
  if (!defaultClasses && !userClasses) return ""

  const map = new Map<string, string>()

  const add = (input?: string) => {
    if (!input) return

    const classes = input.trim().split(/\s+/)

    for (const cls of classes) {
      if (!cls) continue

      const { variants, base, important } = parseClass(cls)
      const group = getUtilityGroup(base)

      const key =
        variants +
        (important ? "!" : "") +
        group
      map.set(key, cls)
    }
  }

  // Apply defaults first
  add(defaultClasses)

  // User overrides
  add(userClasses)

  return Array.from(map.values()).join(" ")
}
// export function mergeClasses(
//   defaultClasses?: string,
//   userClasses?: string
// ): string {
//   if (!defaultClasses && !userClasses) return ""

//   const map = new Map<string, string>()

//   const add = (input?: string) => {
//     if (!input) return

//     const classes = input.split(/\s+/)

//     for (const cls of classes) {
//       if (!cls) continue

//       const key = getUtilityKey(cls)
//       map.set(key, cls)
//     }
//   }

//   // Apply defaults first
//   add(defaultClasses)

//   // User overrides
//   add(userClasses)

//   return Array.from(map.values()).join(" ")
// }

/**
 * Generates a grouping key for Tailwind utilities.
 *
 * Examples:
 * text-blue-600  -> text
 * bg-red-400     -> bg
 * border-2       -> border
 * border-t-2     -> border-t
 * px-4           -> px
 * p-2            -> p
 */
function getUtilityKey(cls: string): string {
  const parts = cls.split("-")

  if (parts.length === 1) return cls

  // Handle directional utilities like border-t-2
  if (parts[0] === "border" && parts.length > 2) {
    return `${parts[0]}-${parts[1]}`
  }

  // Handle padding/margin axis utilities
  if ((parts[0] === "p" || parts[0] === "m") && parts.length > 1) {
    return parts[0] === "p" || parts[0] === "m"
      ? parts[0] + (parts[1].length === 1 ? parts[1] : "")
      : parts[0]
  }

  return parts[0]
}


function getUtilityGroup(base: string): string {
  // Exact utilities
  if (base === "container") return "container"

  // Padding & margin axis
  if (/^p[trblxy]?-\S+/.test(base)) return base.match(/^p[trblxy]?/)![0]
  if (/^m[trblxy]?-\S+/.test(base)) return base.match(/^m[trblxy]?/)![0]

  // Background
  if (base.startsWith("bg-")) return "bg"

  // Text utilities
  if (base.startsWith("text-")) {
    if (/^text-(xs|sm|base|lg|xl|\d)/.test(base)) return "text-size"
    if (base.includes("opacity")) return "text-opacity"
    return "text-color"
  }

  // Font weight
  if (base.startsWith("font-")) return "font"

  // Border utilities
  if (base === "border") return "border"
  if (/^border-[trblxy]?-\S+/.test(base))
    return base.match(/^border-[trblxy]?/)![0]

  // Rounded
  if (/^rounded([trbl]{1,2})?-\S+/.test(base))
    return base.match(/^rounded([trbl]{1,2})?/)![0]

  // Ring
  if (base.startsWith("ring-offset-")) return "ring-offset"
  if (base.startsWith("ring-")) return "ring"

  // Width / Height
  if (base.startsWith("w-")) return "w"
  if (base.startsWith("h-")) return "h"
  if (base.startsWith("min-w-")) return "min-w"
  if (base.startsWith("min-h-")) return "min-h"

  // Flex/grid
  if (base.startsWith("flex-")) return "flex"
  if (base.startsWith("grid-")) return "grid"

  // Default fallback: first segment
  return base.split("-")[0]
}

function parseClass(cls: string) {
  // Handle important modifier
  const important = cls.startsWith("!")
  const cleaned = important ? cls.slice(1) : cls

  // Split variant chain
  const parts = cleaned.split(":")
  const base = parts.pop()!
  const variants = parts.length ? parts.join(":") + ":" : ""

  return {
    variants,
    base,
    important,
  }
}
