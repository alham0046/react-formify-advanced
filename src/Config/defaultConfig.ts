// // defaultConfig.ts
// import type { FormifyConfig } from './formifyConfig'

// import { FieldVisualState } from "../InputStyles";
import { FieldVisualState } from "./FieldVisualState";
import type { FormifyConfig } from "./formifyConfig";

export const defaultConfig: Required<FormifyConfig> = {
  inputStyles: {
    [FieldVisualState.Edited]: 'text-blue-500',
    [FieldVisualState.Error]: 'border-red-500',
    [FieldVisualState.Warning]: 'border-yellow-500',
    [FieldVisualState.Focus]: '',
    [FieldVisualState.Disabled]: 'opacity-60 cursor-not-allowed',
  },
}
