import { CSSProperties } from "react";

export interface DropdownStyleProp {
    dropdownOffset: number;
    selectedStyles: CSSProperties;
    highlightedStyles: CSSProperties;
    modalBoxStyles: CSSProperties
    optionBoxStyles: CSSProperties
    optionStyles: CSSProperties
}

export interface InputStyle {
    borderWidth: number | string
    boxHeight: number | string
    boxWidth: number | string
    placeHolderOffset: number | string
    containerStyles: CSSProperties
    /* visuals only */
    inputInlineStyle?: Omit<
        React.CSSProperties,
        'border' | 'borderWidth'
    >
    placeholderInlineStyle?: React.CSSProperties
}

// export const DEFAULT_INPUT_STYLE: InputStyle = {
//   borderWidth: '2px',
//   boxHeight: '8px',
//   boxWidth: '100%',
//   placeHolderOffset: '16px',
// }

export interface TWDropdownStyleProp {
    twSelectedStyles: string;
    twHighlightedStyles: string
    twModalBoxStyles: string;
    twOptionBoxStyles: string;
    twOptionItemStyles: string;
}

export interface TWInputStyleProp {
    twInputStyles: string
    twPlaceholderStyles: string
    twContainerStyles: string
}

// export interface InputStyle {
//     /* geometry */
//     borderWidth: number | string
//     boxHeight: number | string
//     boxWidth: number | string
//     placeHolderOffset: number | string

//     /* shape */
//     borderRadius?: number | string
//     borderStyle?: 'solid' | 'dashed' | 'dotted'

//     /* spacing */
//     paddingX?: number | string
//     paddingY?: number | string
//     labelPaddingX?: number | string

//     /* typography */
//     fontSize?: number | string
//     labelFontSize?: number | string
//     labelScale?: number
//     fontWeight?: number | string
//     letterSpacing?: number | string
//     lineHeight?: number | string

//     /* colors */
//     colors?: {
//         border?: string
//         focusBorder?: string
//         errorBorder?: string
//         text?: string
//         placeholder?: string
//         label?: string
//         disabled?: string
//         background?: string
//     }

//     /* motion */
//     transitionDuration?: number
//     transitionEasing?: string

//     /* behavior */
//     floatOnFocusOnly?: boolean
//     alwaysFloatLabel?: boolean
//     cutBorder?: boolean
// }


