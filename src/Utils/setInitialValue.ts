import type { InputStore } from "../store/InputStore";

export const handleInitialValue = (name: string, initialValue: string, inputStore: InputStore, isDisabledInput: boolean = false) => {
    const existingValue = inputStore.getValue(name);
    const pendingValue = inputStore.getPendingInitialData(name);
    const value = existingValue || initialValue || pendingValue
    inputStore.setFieldInitialData(name, value, isDisabledInput)
}



// import { inputStore } from "../store/InputStore";

// export const handleInitialValue = (name: string, initialValue: string, compName?: string) => {
//     const storedData = inputStore.getSnapshot().inputData;
//     if (!storedData) {
//         return;
//     }
//     const value = storedData[name] || initialValue
//     if (value) {
//         inputStore.currentValue = initialValue
//     }
//     inputStore.setValue(name, value)
// }

















// import { inputStore } from "../store/InputStore";

// export const handleInitialValue = (name : string, initialValue : string,setInputValue : (name : string, value : any) => void, compName : string) => {
//     const storedData = inputStore.getSnapshot().inputData;
//     if (!storedData) {
//         return;
//     }
//     const value = storedData[name] || initialValue || ""
//     if (!['ArrayInput', 'ObjectContainer'].includes(compName)) {
//         setTimeout(() => {
//             setInputValue(name, value)
//         }, 0);
//     }
// }