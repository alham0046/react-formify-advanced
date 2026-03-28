import { BaseInputProps } from "./baseProps";
import { InputStyle, TWInputStyleProp } from "./stylesProps";

export interface FullInputProps extends BaseInputProps {
    maxLength?: number
    autoFocus?: boolean
    privacy?: boolean
}

// export type InputProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;
export type InputProps = FullInputProps & Validation


export interface OnInputChangeArgs {
  value: string | number
  setValue: (field: FieldProps) => void
}

export interface FieldProps {
    [key: string]: any;
}

export type OnInputChange = (args: OnInputChangeArgs) => void

export interface onEnterPressArgs extends OnInputChangeArgs {
  stopPropagation: () => void
  data: Record<string, any>
}

export type OnEnterPress = (args: onEnterPressArgs) => void

export interface OnBlurArgs extends OnInputChangeArgs {
  data: Record<string, any>
}

export type OnBlur = (args: OnBlurArgs) => void

export interface OnSubmitArgs {
  data: Record<string, any> | null
  edited: Record<string, any> | null
  resetForm: (key?: string[] | string) => void;
  clearForm: () => void
  stopPropagation: () => void
  preventDefault: () => void
}

export type OnSubmit = (args: OnSubmitArgs) => boolean | void | Promise<boolean | void>

export interface Validation {
  required?: boolean
}


export interface InputRefProps {
    focus: () => void
    blur: () => void
    reset: () => void
}



type Year = `${number}${number}${number}${number}`
type Month = `0${1|2|3|4|5|6|7|8|9}` | `1${0|1|2}`
type Day =
  | `0${1|2|3|4|5|6|7|8|9}`
  | `${1|2}${number}`
  | `3${0|1}`

export type DateString = `${Year}-${Month}-${Day}`