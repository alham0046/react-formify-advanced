// import { isArray } from "src/functions/dataTypesValidation";
// import { isEqual } from "src/functions/isEqual";
// import { getNestedValue } from "src/Utils/inputStoreUtils";
// import { create } from "zustand";
// import { subscribeWithSelector } from "zustand/middleware";

// export interface InputData {
//   [key: string]: any;
// }

// interface InputStore {
//   inputData: InputData;
//   editedKeys: Set<string> | null,
//   initialData: InputData | null,
//   currentInputKey: string | null;
//   setCurrentInputKey: (key: string | null) => void;
//   setInputValue: (key: string, value: any) => void;
//   setInitialInputData: (data: InputData) => void
//   resetInput: (key?: string[] | string) => void;
// }

// export const useInputStore = create<InputStore>()(
//   subscribeWithSelector((set, get) => ({
//     inputData: {},
//     currentInputKey: null,
//     // <-----------------------  EDIT TRACKING FIELDS START ----------------------->
//     editedKeys: null,
//     initialData: null,
//     // <-----------------------  EDIT TRACKING FIELDS END ------------------------>
//     setCurrentInputKey: (key) => {
//       set((state) => {
//         if (state.currentInputKey === key) return state
//         return { currentInputKey: key }
//       })
//     },
//     setInputValue: (key: string, value: any) =>
//       set((state) => {
//         const keys = key.split(".");
//         const current = structuredClone(state.inputData)
//         let obj = current

//         for (let i = 0; i < keys.length - 1; i++) {
//           obj[keys[i]] ??= {}
//           obj = obj[keys[i]]
//         }

//         obj[keys.at(-1)!] = value

//         // ✨ EDIT TRACKING
//         if (state.initialData) {
//           const initialValue = getNestedValue(state.initialData, key)
//           const editedKeys = new Set(state.editedKeys ?? [])

//           if (!isEqual(initialValue, value)) {
//             editedKeys.add(key)
//           } else {
//             editedKeys.delete(key)
//           }

//           return {
//             inputData: current,
//             editedKeys
//           }
//         }

//         return { inputData: current }
//       }),
//     setInitialInputData: (data) => set((state) => ({
//       inputData: {
//         ...state.inputData,
//         ...data
//       }
//     })),
//     resetInput: (keys) =>
//       set((state) => {
//         if (!keys) return { inputData: {}, editedKeys: null, initialData: null }

//         const newInputData = { ...state.inputData }
//         if (isArray(keys)) {
//           keys.forEach((key) => delete newInputData[key])
//         }
//         else {
//           delete newInputData[keys]
//         }
//         return { inputData: newInputData }
//       })
//   }))
// );


// import { useSyncExternalStore } from 'react'
// import { inputStore } from '../store/InputStore'

// export function useInputStore<T>(
//   selector: (state: any) => T
// ): T {
//   return useSyncExternalStore(
//     inputStore.subscribe,
//     () => selector(inputStore.getSnapshot())
//   )
// }




// import { useEffect, useRef, useSyncExternalStore } from 'react'
// import { useContainerContext } from '../context/ContainerContext'
// // import { inputStore } from '../store/InputStore'

// export function useInputStore(key: string) {
//   const valueRef = useRef("")
//   const { inputStore } = useContainerContext()
//   const initialRender = useRef(true)
//   useEffect(() => {
//     setTimeout(() => {
//       initialRender.current = false
//     }, 200);
//   }, [])
//   return useSyncExternalStore(
//     (listener) => inputStore.subscribe(key, listener),
//     () => {
//       // if (inputStore.isEditMode) {
//       if (initialRender.current) {
//         // if (valueRef.current === inputStore.getSnapshot().inputData![key]) return valueRef.current
//         if (valueRef.current === inputStore.getInputNestedValue(key)) return valueRef.current
//       }
//       if (valueRef.current === inputStore.currentValue) return valueRef.current
//       const value = inputStore.getHookValue(key)
//       valueRef.current = value
//       return value
//     }
//   )
// }
// import { useSyncExternalStore } from 'react'
// import type { InputStore } from '../store/InputStore'

// export function useInputStore(key: string, inputStore: InputStore) {
//   return useSyncExternalStore(
//     (listener) => inputStore.subscribe(key, listener),
//     () => {
//       const value = inputStore.getValue(key)
//       return value? value : ""
//     }
//   )
// }
import { useSyncExternalStore } from 'react'
import type { InputStore } from '../store/InputStore'

export function useInputStore(key: string, inputStore: InputStore) {
  // const { inputStore } = useContainerContext()
  return useSyncExternalStore(
    (listener) => inputStore.subscribe(key, listener),
    () => inputStore.getValue(key) ?? ""
  )
}
