import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useInputStore } from "../hooks/useInputStore";
import { type DropdownStyleProp, type TWDropdownStyleProp, type TWInputStyleProp } from "../typeDeclaration/stylesProps";
// import { createPortal } from 'react-dom'
import { shallowOrDeepEqual } from "../functions/shallowOrDeepEqual";
import type { InputStyle } from "./InputTemplate";
import BaseDropdown from "./BaseDropdown";
import RotatingDropdown, { type RotatingDropdownRef } from "../Icons/RotatingDropdown";
import { useContainerContext } from "../context/ContainerContext";
import DropdownLabel from "./DropdownLabel";


interface DropdownOption {
    label: string;
    value: string;
}
interface DropdownModalProps {
    // options: DropdownOption[];
    // options: {optionsList: DropdownOption[], valueToLabel : Map<string, string>}
    onSelect: (value: string) => void;
    disabled: boolean;
    searchable: boolean;
    initialLabel?: string
    // style: StyleProp
    style: Partial<InputStyle & DropdownStyleProp>
    twStyle: Partial<TWDropdownStyleProp & TWInputStyleProp>
    name: string;
    onToggleDropdown?: (isOpen: boolean) => void;
    modalContainerRef?: React.RefObject<HTMLDivElement>;
    // You should typically pass the current value in as a prop for a controlled component
    initialValue?: string;
}

const DropdownModal: FC<DropdownModalProps> = ({
    // options,
    onSelect,
    onToggleDropdown,
    disabled,
    searchable,
    initialLabel,
    name,
    style,
    twStyle,
    modalContainerRef,
}) => {
    // const {optionsList, valueToLabel} = options
    const {inputStore} = useContainerContext()
    // const value: string = useInputStore(name, inputStore)
    const rotateRef = useRef<RotatingDropdownRef>(null)
    const [isOpen, setIsOpen] = useState(false);
    // const [label, setLabel] = useState(value ||'Select an Option');
    const {inputInlineStyle, dropdownOffset} = style
    const {twOptionItemStyles, twInputStyles,twOptionBoxStyles="", twSelectedStyles} = twStyle
    
    const inputRef = useRef<HTMLDivElement>(null);

    const handleOptionSelect = useCallback((option: DropdownOption) => {
        const selectedValue = option.value;
        onSelect(selectedValue);
        closeDropdown();
        // setLabel(selectedValue)
    }, [onSelect]);

    const openDropdown = useCallback(() => {
      if (isOpen) return
      if (disabled) return
      rotateRef.current?.open()
      setIsOpen(true)
    }, [isOpen, disabled])
    
    const closeDropdown = useCallback(() => {
        rotateRef.current?.close()
      setIsOpen(false)
    }, [isOpen])

    useEffect(() => {
        onToggleDropdown?.(isOpen);
        if (!isOpen) {
            inputStore.optionGraph.setSearch(name, "")   
        }
    }, [isOpen])


    return (
        <div
            ref={inputRef}
            onClick={(e) => {
              e.stopPropagation()
              openDropdown()
            }}
            // onKeyDown={handleKeyDown}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                closeDropdown()
                return // allow normal tab navigation
              }
            }}
            onFocus={openDropdown}
            tabIndex={0} // Makes the div focusable for keyboard navigation
            // style={inputInlineStyle}
            // className={`relative w-full flex input-border justify-between items-center rounded-lg outline-none bg-transparent ${twInputStyles}`}
            className={`relative outline-none`}
            // className={`relative outline-none ${twInputStyles}`}
        >
          <DropdownLabel initialLabel={initialLabel} name={name} twInputStyles={twInputStyles} inputInlineStyle={inputInlineStyle} inputStore={inputStore} />
            {/* <div
                className={`input-border cursor-pointer ${twInputStyles}`}
                style={inputInlineStyle}
            >
                {valueToLabel.get(value) || initialLabel || 'Select an Option'}
            </div> */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2"><RotatingDropdown ref={rotateRef} /></div>
            {isOpen && (
                <BaseDropdown
                    open={isOpen}
                    name={name}
                    twOptionBoxStyles={twOptionBoxStyles}
                    // options={optionsList}
                    close={closeDropdown}
                    // value={value}
                    onSelect={(opt) => {
                      handleOptionSelect(opt as DropdownOption)
                    }}
                    // position={position}
                    inputRef={inputRef}
                    dropdownOffset={dropdownOffset}
                    searchable={searchable}
                    // onSearchChange={(v) => {
                    //   setSearch(v)
                    // }}
                    renderItem={(opt, index, highlighted, ref, onHover, isSelected) => {
                        const option = opt as DropdownOption
                        return (
                        <div
                          key={option.value}
                          ref={ref}
                          onMouseEnter={onHover}
                        //   className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 ${isSelected ? twSelectedStyles : ""}`}
                          className={`${twOptionItemStyles} ${isSelected ? twSelectedStyles : ""}`}
                        //   className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 ${
                        //     highlighted ? twHighlightedStyles : ""
                        //   }`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleOptionSelect(option)
                        }}
                        >
                          {option.label}
                        </div>
                    )
                }}
                />
            )}
            {/* {isOpen && dropdownPanel} */}
        </div>
    )
}

export default memo(DropdownModal)
// export default memo(DropdownModal, (prev, next) => shallowOrDeepEqual(prev.options, next.options))
// export default memo(DropdownModal)
// export default memo(DropdownModal, (prev, next) => isEqual(prev.options, next.options))
























// import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
// import { useInputStore } from "../hooks/useInputStore";
// import { type DropdownStyleProp, type TWDropdownStyleProp, type TWInputStyleProp } from "../typeDeclaration/stylesProps";
// // import { createPortal } from 'react-dom'
// import { shallowOrDeepEqual } from "../functions/shallowOrDeepEqual";
// import type { InputStyle } from "./InputTemplate";
// import BaseDropdown from "./BaseDropdown";
// import RotatingDropdown, { type RotatingDropdownRef } from "../Icons/RotatingDropdown";
// import { useContainerContext } from "../context/ContainerContext";


// interface DropdownOption {
//     label: string;
//     value: string;
// }
// interface DropdownModalProps {
//     // options: DropdownOption[];
//     options: {optionsList: DropdownOption[], valueToLabel : Map<string, string>}
//     onSelect: (value: string) => void;
//     disabled: boolean;
//     searchable: boolean;
//     initialLabel?: string
//     // style: StyleProp
//     style: Partial<InputStyle & DropdownStyleProp>
//     twStyle: Partial<TWDropdownStyleProp & TWInputStyleProp>
//     name: string;
//     onToggleDropdown?: (isOpen: boolean) => void;
//     modalContainerRef?: React.RefObject<HTMLDivElement>;
//     // You should typically pass the current value in as a prop for a controlled component
//     initialValue?: string;
// }

// const DropdownModal: FC<DropdownModalProps> = ({
//     options,
//     onSelect,
//     onToggleDropdown,
//     disabled,
//     searchable,
//     initialLabel,
//     name,
//     style,
//     twStyle,
//     modalContainerRef,
// }) => {
//     const {optionsList, valueToLabel} = options
//     const {inputStore} = useContainerContext()
//     const value: string = useInputStore(name, inputStore)
//     const rotateRef = useRef<RotatingDropdownRef>(null)
//     const [isOpen, setIsOpen] = useState(false);
//     // const [label, setLabel] = useState(value ||'Select an Option');
//     const {inputInlineStyle, dropdownOffset} = style
//     const {twOptionItemStyles, twInputStyles,twOptionBoxStyles="", twSelectedStyles} = twStyle
    
//     const inputRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!isOpen) return
//         const handleClickOutside = (event: MouseEvent) => {
//             if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
//                 // setIsOpen(false);
//                 closeDropdown();
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isOpen]);

//     const handleOptionSelect = useCallback((option: DropdownOption) => {
//         const selectedValue = option.value;
//         onSelect(selectedValue);
//         closeDropdown();
//         // setLabel(selectedValue)
//     }, [onSelect]);

//     const openDropdown = useCallback(() => {
//       if (isOpen) return
//       if (disabled) return
//       rotateRef.current?.open()
//       setIsOpen(true)
//     }, [isOpen, disabled])
    
//     const closeDropdown = useCallback(() => {
//         rotateRef.current?.close()
//       setIsOpen(false)
//     }, [isOpen])

//     useEffect(() => {
//         onToggleDropdown?.(isOpen);
//     }, [isOpen])


//     return (
//         <div
//             ref={inputRef}
//             onClick={openDropdown}
//             // onKeyDown={handleKeyDown}
//             onBlur={closeDropdown}
//             onFocus={openDropdown}
//             tabIndex={0} // Makes the div focusable for keyboard navigation
//             // style={inputInlineStyle}
//             // className={`relative w-full flex input-border justify-between items-center rounded-lg outline-none bg-transparent ${twInputStyles}`}
//             className={`relative outline-none`}
//             // className={`relative outline-none ${twInputStyles}`}
//         >
//             <div
//                 className={`input-border cursor-pointer ${twInputStyles}`}
//                 style={inputInlineStyle}
//             >
//                 {valueToLabel.get(value) || initialLabel || 'Select an Option'}
//             </div>
//             <div className="absolute right-4 top-1/2 transform -translate-y-1/2"><RotatingDropdown ref={rotateRef} /></div>
//             {isOpen && (
//                 <BaseDropdown
//                     open={isOpen}
//                     name={name}
//                     twOptionBoxStyles={twOptionBoxStyles}
//                     options={optionsList}
//                     close={closeDropdown}
//                     value={value}
//                     onSelect={(opt) => {
//                       handleOptionSelect(opt as DropdownOption)
//                     }}
//                     // position={position}
//                     inputRef={inputRef}
//                     dropdownOffset={dropdownOffset}
//                     searchable={searchable}
//                     // onSearchChange={(v) => {
//                     //   setSearch(v)
//                     // }}
//                     renderItem={(opt, index, highlighted, ref, onHover, isSelected) => {
//                         const option = opt as DropdownOption
//                         return (
//                         <div
//                           key={option.value}
//                           ref={ref}
//                           onMouseEnter={onHover}
//                         //   className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 ${isSelected ? twSelectedStyles : ""}`}
//                           className={`${twOptionItemStyles} ${isSelected ? twSelectedStyles : ""}`}
//                         //   className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 ${
//                         //     highlighted ? twHighlightedStyles : ""
//                         //   }`}
//                           onMouseDown={(e) => {
//                             e.preventDefault()
//                             handleOptionSelect(option)
//                         }}
//                         >
//                           {option.label}
//                         </div>
//                     )
//                 }}
//                 />
//             )}
//             {/* {isOpen && dropdownPanel} */}
//         </div>
//     )
// }

// export default memo(DropdownModal, (prev, next) => shallowOrDeepEqual(prev.options, next.options))
// // export default memo(DropdownModal)
// // export default memo(DropdownModal, (prev, next) => isEqual(prev.options, next.options))