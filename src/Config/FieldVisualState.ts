export const FieldVisualState = {
  Edited: 'edited',
  Error: 'error',
  Warning: 'warning',
  Focus: 'focus',
  Disabled: 'disabled',
} as const

export type FieldVisualState =
  (typeof FieldVisualState)[keyof typeof FieldVisualState]
