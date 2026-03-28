import type { InputStore } from "../store/InputStore"
import { getNestedValue } from "./inputStoreUtils"


export const getEditedData = (inputStore : InputStore) : { data: Record<string, any> | null, edited: Record<string, any> | null } => {
    console.log("getting edited data")
    const { editedKeys, inputData } = inputStore.getSnapshot()
    const edited: Record<string, any> = {}

    if (!editedKeys || editedKeys.size === 0) {
        return {
            data: inputData,
            edited: null,
        }
    }
    editedKeys.forEach((key) => {
        edited[key] = getNestedValue(inputData, key)
    })
    return {
        data: inputData,
        edited,
    }
}

// return {
//     data: state.inputData,
//     edited,
// }
// }
