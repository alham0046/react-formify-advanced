import { useMemo } from "react"
import { useContainerContext } from "../context/ContainerContext"
import { FieldProps } from "@/typeDeclaration/baseProps"

export const useFormActions = () => {
    const { inputStore } = useContainerContext()
    return useMemo(() => ({
        setValue: (FieldCredentials: FieldProps) => {
            const keys = Object.keys(FieldCredentials);
            for (const key of keys) {
                inputStore.setValue(key, FieldCredentials[key])
            }
        },
        submit: () => inputStore.triggerSubmit(),
        reset: () => inputStore.reset()
    }), [inputStore])
}