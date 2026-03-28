import type { InputStyle } from "../components/InputTemplate";
import type { TWInputStyleProp } from "./stylesProps";

export interface BaseInputProps< T={}, U={}> {
    placeholder: string;
    children?: React.ReactNode;
    initialValue?: string;
    // borderWidth?: number | string
    twStyle?: Partial<TWInputStyleProp & T>
    style?: Partial<InputStyle & U>
    disabled?: string | boolean
    hideElement?: string | boolean
    onEnterPress?: OnEnterPress
    // onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    onBlur?: OnBlur
    // onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    name?: string;
    onChange?: OnInputChange
    onDisableChange?: (args: {
        state: boolean,
        disabledKey?: string,
        disabledValue: any,
        storeValue: Record<string, any> | null,
        setValue: (value: any) => void
    }) => void
}

// type twBaseProp = Partial<TWInputStyleProp>

// type styleBaseProp = Partial<InputStyle>

export interface OnInputChangeArgs {
  value: string | number
  setValue: (field: FieldProps) => void
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

export interface FieldProps {
    [key: string]: any;
}