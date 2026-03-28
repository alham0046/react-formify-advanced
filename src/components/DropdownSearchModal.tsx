import React, { memo, useSyncExternalStore, type CSSProperties } from 'react'
import BaseDropdown from './BaseDropdown'
import { useContainerContext } from '../context/ContainerContext'

interface DropdownSearchModalProps<T> {
    // open: boolean
    // options: T[]
    // style: Partial<InputStyle & DropdownStyleProp>
    // twStyle: Partial<TWDropdownStyleProp & TWInputStyleProp>
    dropdownOffset: number
    twOptionBoxStyles: string
    twOptionItemStyles: string
    optionBoxStyles?: CSSProperties
    optionItemStyles?: CSSProperties
    name: string
    onSelect: (item: T, setValue: (value: any) => void) => void
    renderItem?: (item: T, index: number, active: boolean, ref : (el: HTMLDivElement | null) => void) => React.ReactNode
}

const DropdownSearchModal: React.FC<DropdownSearchModalProps<any>> = ({
    // open,
    // options,
    name,
    dropdownOffset,
    twOptionBoxStyles,
    twOptionItemStyles,
    optionBoxStyles,
    optionItemStyles,
    // style,
    // twStyle,
    onSelect,
    renderItem,
}) => {
    // console.log('lkdjfgos')
    const { inputStore } = useContainerContext()
    // const {twOptionItemStyles} = twStyle
    const options: any[] = useSyncExternalStore(
        (listener) => inputStore.subscribe(`d_${name}`, listener),
        () => { return inputStore.getDropdownSearch(`d_${name}`) }
    )

    const setDropdownValue = (value: any) => {
        inputStore.setValue(name, value)
    }

    const inputRef = inputStore.getDropdownContext(`ref_${name}`)

    const closeDropdown = () => {
        inputStore.setDropdownSearch(`d_${name}`, [])
    }

    // const staticOptions = useSelectOptions({
    //     options,
    // })

    // const { dropdownOffset } = style

    console.log('logging outside')

    const optionLength = options?.length > 0 || false

    // Reset active index when options change

    const handleOptionSelect = (opt: any) => {
        if (onSelect) {
            onSelect(opt, setDropdownValue)
        } else {
            const finalValue =
                typeof opt === "object" && opt !== null && "value" in opt
                    ? (opt as any).value
                    : opt

            inputStore.setValue(name, finalValue)
        }
        // console.log('opt', opt)
        // onSelect ? onSelect(opt, setDropdownValue) : inputStore.setValue(name, opt)
        // inputStore.setValue(name, opt)
        closeDropdown()
    }

    // useEffect(() => {
    //     if (!optionLength) return;

    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (
    //             inputRef.current &&
    //             !inputRef.current.contains(event.target as Node)
    //         ) {
    //             closeDropdown();
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [optionLength, inputRef]);


    if (!optionLength) return null

    return (
        <>
            {/* {console.log('optionLength', options)} */}
            <BaseDropdown
                open={optionLength}
                name={name}
                twOptionBoxStyles={twOptionBoxStyles}
                options={options}
                close={closeDropdown}
                onSelect={(opt) => {
                    handleOptionSelect(opt)
                }}
                // position={position}
                inputRef={inputRef}
                dropdownOffset={dropdownOffset}
                // onSearchChange={(v) => {
                //   setSearch(v)
                // }}
                renderItem={(item, index, highlighted, ref, onHover) => (
                    <div
                        key={index}
                        ref={ref}
                        // className={`px-3 py-2 cursor-pointer`}
                        className={`${twOptionItemStyles}`}
                        style={optionItemStyles}
                        onMouseEnter={onHover}
                        onMouseDown={(e) => {
                            e.preventDefault()
                            handleOptionSelect(item)
                            // onSelect(item)
                        }}
                    >
                        {renderItem ? renderItem(item, index, highlighted, ref) : String(item)}
                    </div>
                )}
            />
        </>
    )
}

export default memo(DropdownSearchModal)






// import React, { memo, useEffect, useRef, useState } from 'react'

// interface DropdownSearchModalProps<T> {
//     open: boolean
//     options: T[]
//     onSelect: (item: T) => void
//     renderItem?: (item: T, index: number, active: boolean) => React.ReactNode
// }

// const DropdownSearchModal: React.FC<DropdownSearchModalProps<any>> = ({
//     open,
//     options,
//     onSelect,
//     renderItem,
// }) => {
//     const [activeIndex, setActiveIndex] = useState(0)
//     const listRef = useRef<HTMLDivElement>(null)

//     // Reset active index when options change
//     useEffect(() => {
//         setActiveIndex(0)
//     }, [options])

//     // Keyboard navigation
//     useEffect(() => {
//         if (!open) return

//         const handleKeyDown = (e: KeyboardEvent) => {
//             switch (e.key) {
//                 case "ArrowDown":
//                     e.preventDefault()
//                     setActiveIndex((prev) =>
//                         prev < options.length - 1 ? prev + 1 : prev
//                     )
//                     break

//                 case "ArrowUp":
//                     e.preventDefault()
//                     setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
//                     break

//                 case "Enter":
//                     e.preventDefault()
//                     options[activeIndex] && onSelect(options[activeIndex])
//                     break

//                 case "Escape":
//                     e.preventDefault()
//                     setActiveIndex(0)
//                     break
//             }
//         }

//         window.addEventListener("keydown", handleKeyDown)
//         return () => window.removeEventListener("keydown", handleKeyDown)
//     }, [open, activeIndex, options, onSelect])


//     if (!open) return null

//     return (
//         <div
//             ref={listRef}
//             role="listbox"
//             className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md"
//         >
//             {options.map((item, index) => {
//                 const active = index === activeIndex

//                 return (
//                     <div
//                         key={index}
//                         role="option"
//                         aria-selected={active}
//                         onMouseEnter={() => setActiveIndex(index)}
//                         onMouseDown={() => onSelect(item)} // mouseDown > click (prevents blur)
//                         className={`cursor-pointer ${active ? "bg-gray-100" : ""
//                             }`}
//                     >
//                         {renderItem
//                             ? renderItem(item, index, active)
//                             : String(item)}
//                     </div>
//                 )
//             })}
//         </div>
//     )
// }

// export default memo(DropdownSearchModal)











// <div
//     ref={listRef}
//     role="listbox"
//     className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md"
//     >
//     {console.log('rendering DropdownSearchModal')}
//     {options.map((item, index) => {
//         const active = index === activeIndex

//         return (
//             <div
//                 key={index}
//                 role="option"
//                 aria-selected={active}
//                 onMouseEnter={() => setActiveIndex(index)}
//                 onMouseDown={() => onSelect(item)} // mouseDown > click (prevents blur)
//                 className={`cursor-pointer ${active ? "bg-gray-100" : ""
//                     }`}
//             >
//                 {renderItem
//                     ? renderItem(item, index, active)
//                     : String(item)}
//             </div>
//         )
//     })}
// </div>