// // formifyConfig.ts
// export interface FormifyStyleConfig {
//   edited?: string
//   error?: string
//   warning?: string
//   success?: string
//   focus?: string
//   disabled?: string
// }

// export interface FormifyConfig {
//   inputStyles?: FormifyStyleConfig
// }

export type FormifyStyleInput =
  | string
  | string[]
  | React.CSSProperties
  | null
  | false

export interface FormifyConfig {
  inputStyles?: {
    edited?: FormifyStyleInput
    error?: FormifyStyleInput
    warning?: FormifyStyleInput
    disabled?: FormifyStyleInput
    focus?: FormifyStyleInput
  }
}
