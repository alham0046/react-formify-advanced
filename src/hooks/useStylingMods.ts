import { useMemo } from "react"
import { useContainerContext } from "../context/ContainerContext"
import { resolveTwStyles } from "../Utils/resolveTwStyles"
import type { TWDropdownStyleProp, TWInputStyleProp } from "../typeDeclaration/stylesProps";

// 1. Create a helper to determine the TW type dynamically
type DynamicTWStyle<T> = T extends "dropdown"
    ? Partial<TWInputStyleProp & TWDropdownStyleProp>
    : Partial<TWInputStyleProp>;

export const useStyles = <T extends "input" | "dropdown" = "input">(
    style: any,
    twStyle: DynamicTWStyle<T>,
    // type: "input" | "dropdown" = "input"
    type: T = "input" as T // 👈 Change "input" | "dropdown" to just T
) => {
    const { sharedStyles, sharedTw, sharedDropdownStyles, sharedDropdownTw } = useContainerContext()

    const isInput = type === "input"
    const sharedStylesToUse = isInput ? sharedStyles : sharedDropdownStyles
    const sharedTwToUse = isInput ? sharedTw : sharedDropdownTw

    const resolvedStyle = useMemo(() => {
        if (!style) return sharedStylesToUse
        return {
            ...sharedStylesToUse,
            ...style, // 👈 highest priority
        }
    }, [sharedStyles, style])


    const tw = useMemo(() => {
        if (!twStyle) return sharedTwToUse
        return (resolveTwStyles({
            defaultStyles: sharedTwToUse,
            localStyles: twStyle, // from props
        }))
    }, [sharedTw, twStyle])

    return {
        resolvedStyle,
        tw: tw as DynamicTWStyle<T>,
    }
}