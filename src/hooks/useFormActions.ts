import { useCallback, useMemo } from "react"
import { useContainerContext } from "../context/ContainerContext"
import { FieldProps } from "@/typeDeclaration/baseProps"
import { DropdownOption } from "@/components/BaseDropdown"
import { ArrayHelpers } from "@/components/ArrayContainer"

export const useFormActions = () => {
    const { inputStore } = useContainerContext()
    return useMemo(() => ({
        setValue: (FieldCredentials: FieldProps) => {
            // const keys = Object.keys(FieldCredentials);
            for (const key in FieldCredentials) {
                // inputStore.setValue(key, FieldCredentials[key])
                const value = FieldCredentials[key]

                if (Array.isArray(value)) {
                    inputStore.replaceArray(key, value)
                } else {
                    inputStore.setValue(key, value)
                }
            }
        },
        submit: () => inputStore.triggerSubmit(),
        reset: () => inputStore.reset()
    }), [inputStore])
}

export const useFormHelpers = () => {
    const { inputStore } = useContainerContext()

    const setValue = useCallback((fields: FieldProps) => {
        for (const key in fields) {
            const value = fields[key]

            if (Array.isArray(value)) {
                inputStore.replaceArray(key, value)
            } else {
                inputStore.setValue(key, value)
            }
        }
    }, [inputStore])

    const setOptions = useCallback(
        (name: string, options: string[] | DropdownOption[], initialValue?: string) => {
            inputStore.optionGraph.set(name, options, initialValue)
        },
        [inputStore]
    )

    const arrAction = useCallback((path: string) => {
        return {
            add: ({ count, initialValue } = {}) => inputStore.addArrayItem(path, initialValue, count),
            remove: (index) => inputStore.removeArrayItem(path, index),
            pop: () => inputStore.popArrayItem(path),
        } as ArrayHelpers
    }, [inputStore])

    return { setValue, setOptions, arrAction }
}