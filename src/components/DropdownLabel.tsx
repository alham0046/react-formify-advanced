import { useDropdownLabel } from '@/hooks/DropdownHooks'
import type { InputStore } from '../store/InputStore'
import React, { memo } from 'react'

interface DropdownLabelProps {
    name: string
    initialLabel?: string
    twInputStyles?: string
    inputInlineStyle?: React.CSSProperties
    inputStore: InputStore
}

const DropdownLabel : React.FC<DropdownLabelProps> = ({name, initialLabel, twInputStyles, inputInlineStyle, inputStore }) => {
    // const {inputStore} = useContainerContext()
    const label = useDropdownLabel(inputStore, name)
    // const value = useInputStore(name, inputStore)
    return (
        <div
            className={`input-border cursor-pointer ${twInputStyles}`}
            style={inputInlineStyle}
        >
            {label || initialLabel || 'Select an Option'}
        </div>
    )
}

export default memo(DropdownLabel)
