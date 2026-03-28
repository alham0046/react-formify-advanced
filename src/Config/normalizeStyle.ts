import type { FormifyStyleInput } from "./formifyConfig"

export function normalizeStyle(
  input?: FormifyStyleInput
) {
  if (!input) return null

  if (typeof input === 'string') {
    return { className: input }
  }

  if (Array.isArray(input)) {
    return { className: input.join(' ') }
  }

  if (typeof input === 'object') {
    return { style: input }
  }

  return null
}
