import { inputStylesStore } from "../store/InputStyles"
import { defaultConfig } from "./defaultConfig"
import type { FieldVisualState } from "./FieldVisualState"
import type { FormifyConfig } from "./formifyConfig"
import { normalizeStyle } from "./normalizeStyle"

export const normalizeDefault = (state : FieldVisualState) => {
  return normalizeStyle(defaultConfig.inputStyles[state])
}

export function initFormify(userConfig?: FormifyConfig) {
  const merged = {
    ...defaultConfig,
    ...userConfig,
    inputStyles: {
      ...defaultConfig.inputStyles,
      ...userConfig?.inputStyles,
    },
  }

  Object.entries(merged.inputStyles).forEach(([state, style]) => {
    const normalized = normalizeStyle(style)
    if (normalized) {
      inputStylesStore.setStyle(
        state as FieldVisualState,
        normalized
      )
    }
  })
}
// export function initFormify(userConfig?: FormifyConfig) {
//   const merged = {
//     ...defaultConfig,
//     ...userConfig,
//     inputStyles: {
//       ...defaultConfig.inputStyles,
//       ...userConfig?.inputStyles,
//     },
//   }

//   Object.entries(merged.inputStyles).forEach(([state, style]) => {
//     const normalized = normalizeStyle(style)
//     if (normalized) {
//       inputStylesStore.setStyle(
//         state as FieldVisualState,
//         normalized
//       )
//     }
//   })
// }

// initFormify()


// let currentConfig: FormifyConfig = defaultFormifyConfig

// export const setFormifyConfig = (config: FormifyConfig) => {
//   currentConfig = {
//     ...defaultFormifyConfig,
//     ...config,
//     inputStyles: {
//       ...defaultFormifyConfig.inputStyles,
//       ...config.inputStyles,
//     }
//   }
// }

// export const getFormifyConfig = () => currentConfig


// import { defaultConfig } from '../config/defaultConfig'
// import { normalizeStyle } from '../config/normalizeStyle'
// import { inputStyles } from '../styles/InputStyles'
// import { FieldVisualState } from '../styles/FieldVisualState'