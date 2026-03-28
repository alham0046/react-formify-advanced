import React, { memo } from 'react'
import type { BaseDropdownProps, DropdownOption } from './BaseDropdown'

interface DropdownItemProps {
    item: string | DropdownOption
    index: number
    highlighted?: boolean
    isSelected: boolean
    register: (el: HTMLDivElement | null) => void
    renderItem: BaseDropdownProps["renderItem"]
    updateHighlight: (index: number) => void
}

const DropdownItem: React.FC<DropdownItemProps> = ({ item, index, highlighted=false, register, renderItem, updateHighlight, isSelected }) => {
    return (
        <>
            {renderItem(item, index, highlighted, register, () => updateHighlight(index), isSelected)}
        </>
    )
}

export default memo(DropdownItem)
