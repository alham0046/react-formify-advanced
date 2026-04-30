import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDropdownNavigation } from "../hooks/useDropdownNavigation"
import { useDropdownPosition } from "../hooks/useDropdownPosition"
import DropdownItem from "./DropdownItem";
import { useDropdownContext } from "../context/DropdownContext";
import { createPortal } from "react-dom";
import { keyboardAction } from "../Utils/keyboardAction";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface BaseDropdownProps {
  open: boolean
  options: DropdownOption[] | string[]
  name : string
  twOptionBoxStyles: string
  onSelect: (item: string | DropdownOption) => void
  value?: string
  inputRef: React.RefObject<HTMLDivElement | null>
  close: () => void
  dropdownOffset?: number
  renderItem: (
    item: string | DropdownOption,
    index: number,
    highlighted: boolean,
    ref: (el: HTMLDivElement | null) => void,
    onHover: () => void,
    isSelected: boolean
  ) => React.ReactNode
  searchable?: boolean
  onSearchChange?: (v: string) => void
  // position?: {
  //   top?: number
  //   bottom?: number
  //   left?: number
  //   width?: number
  // }
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  open,
  options,
  name,
  twOptionBoxStyles,
  onSelect,
  close,
  renderItem,
  value,
  inputRef,
  dropdownOffset = 0,
  searchable,
  onSearchChange,
}) => {
  const [search, setSearch] = useState('');
  // const { name, twStyle } = useDropdownContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // 1. Handle Positioning
  const { calculatePosition } = useDropdownPosition({
    modalRef: modalRef,
    fixedRef: inputRef,
    isOpen: open,
    dropdownOffset: dropdownOffset
  });

  // 2. Filter Options (Memoized)
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lowered = search.toLowerCase();
    return options.filter((opt) => 
      (opt as DropdownOption).label.toLowerCase().includes(lowered)
    );
  }, [search, options]);

  const {
    highlightIndexRef,
    handleKeyDown,
    registerOption,
    updateHighlight,
    reset,
  } = useDropdownNavigation(filteredOptions, close);

  // 3. Focus and Position Sync
  useLayoutEffect(() => {
    if (open) {
      // Force an immediate calculation when opening
      calculatePosition();
      
      // Focus search if available
      const timer = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
  }, [open, calculatePosition]);

  // Re-calculate if list length changes (e.g., searching)
  useLayoutEffect(() => {
    if (open) calculatePosition();
  }, [filteredOptions.length, calculatePosition]);

  // 4. Global Events (Optimized)
  useEffect(() => {
    if (!open) return;

    const removeAction = keyboardAction('keydown', ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'], (e) => handleKeyDown(e, onSelect));


    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          modalRef.current && !modalRef.current.contains(event.target as Node)) {
        reset();
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    
    return () => {
      removeAction();
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [open, modalRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={modalRef}
      className={`fixed z-2000 top-0 left-0 ${twOptionBoxStyles}`}  /////// also must give zIndex as prop in SelectInput in future to avoid z-index conflict with modals and tooltips
      // Ensure visibility is 'hidden' initially so it doesn't flicker at (0,0)
      style={{ 
        visibility: 'hidden', 
        willChange: 'transform',
        pointerEvents: 'auto' 
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {searchable && (
        <div className="p-2 border-b">
          <input
            id={`search_${name}`}
            ref={searchRef}
            value={search}
            onChange={(e) => {
              reset();
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            className="w-full p-2 px-3 py-1 border rounded"
            placeholder="Search..."
          />
        </div>
      )}

      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">No options found</div>
        ) : (
          filteredOptions.map((item, index) => (
            <DropdownItem
              // key={(item as DropdownOption).value || item}
              key={typeof item === "string" ? item : item.value}
              item={item}
              index={index}
              updateHighlight={updateHighlight}
              highlighted={highlightIndexRef.current === index}
              isSelected={value === ((item as DropdownOption)?.value || item)}
              register={registerOption(index)}
              renderItem={renderItem}
            />
          ))
        )}
      </div>
    </div>,
    document.body
  );
};

export default memo(BaseDropdown)

















// import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
// import { useDropdownNavigation } from "../hooks/useDropdownNavigation"
// import { useDropdownPosition } from "../hooks/useDropdownPosition"
// import DropdownItem from "./DropdownItem";
// import { useDropdownContext } from "../context/DropdownContext";
// import { createPortal } from "react-dom";
// import { keyboardAction } from "../Utils/keyboardAction";

// export interface DropdownOption {
//   label: string;
//   value: string;
// }

// export interface BaseDropdownProps {
//   open: boolean
//   options: DropdownOption[] | string[]
//   name : string
//   twOptionBoxStyles: string
//   onSelect: (item: string | DropdownOption) => void
//   value?: string
//   inputRef: React.RefObject<HTMLDivElement | null>
//   close: () => void
//   dropdownOffset?: number
//   renderItem: (
//     item: string | DropdownOption,
//     index: number,
//     highlighted: boolean,
//     ref: (el: HTMLDivElement | null) => void,
//     onHover: () => void,
//     isSelected: boolean
//   ) => React.ReactNode
//   searchable?: boolean
//   onSearchChange?: (v: string) => void
//   // position?: {
//   //   top?: number
//   //   bottom?: number
//   //   left?: number
//   //   width?: number
//   // }
// }

// const BaseDropdown: React.FC<BaseDropdownProps> = ({
//   open,
//   options,
//   name,
//   twOptionBoxStyles,
//   onSelect,
//   close,
//   renderItem,
//   value,
//   inputRef,
//   dropdownOffset = 0,
//   searchable,
//   onSearchChange,
// }) => {
//   const [search, setSearch] = useState('');
//   // const { name, twStyle } = useDropdownContext();
//   const modalRef = useRef<HTMLDivElement>(null);
//   const searchRef = useRef<HTMLInputElement>(null);

//   // 1. Handle Positioning
//   const { calculatePosition } = useDropdownPosition({
//     modalRef: modalRef,
//     fixedRef: inputRef,
//     isOpen: open,
//     dropdownOffset: dropdownOffset
//   });

//   // 2. Filter Options (Memoized)
//   const filteredOptions = useMemo(() => {
//     if (!search) return options;
//     const lowered = search.toLowerCase();
//     return options.filter((opt) => 
//       (opt as DropdownOption).label.toLowerCase().includes(lowered)
//     );
//   }, [search, options]);

//   const {
//     highlightIndexRef,
//     handleKeyDown,
//     registerOption,
//     updateHighlight,
//     reset,
//   } = useDropdownNavigation(filteredOptions, close);

//   // 3. Focus and Position Sync
//   useLayoutEffect(() => {
//     if (open) {
//       // Force an immediate calculation when opening
//       calculatePosition();
      
//       // Focus search if available
//       const timer = setTimeout(() => searchRef.current?.focus(), 0);
//       return () => clearTimeout(timer);
//     }
//   }, [open, calculatePosition]);

//   // Re-calculate if list length changes (e.g., searching)
//   useLayoutEffect(() => {
//     if (open) calculatePosition();
//   }, [filteredOptions.length, calculatePosition]);

//   // 4. Global Events (Optimized)
//   useEffect(() => {
//     if (!open) return;

//     const removeAction = keyboardAction('keydown', ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'], (e) => handleKeyDown(e, onSelect));


//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
//           modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         reset();
//         close();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
    
//     return () => {
//       removeAction();
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [open, modalRef]);

//   if (!open) return null;

//   return createPortal(
//     <div
//       ref={modalRef}
//       className={`fixed z-2000 top-0 left-0 ${twOptionBoxStyles}`}  /////// also must give zIndex as prop in SelectInput in future to avoid z-index conflict with modals and tooltips
//       // Ensure visibility is 'hidden' initially so it doesn't flicker at (0,0)
//       style={{ 
//         visibility: 'hidden', 
//         willChange: 'transform',
//         pointerEvents: 'auto' 
//       }}
//       onMouseDown={(e) => e.stopPropagation()}
//     >
//       {searchable && (
//         <div className="p-2 border-b">
//           <input
//             id={`search_${name}`}
//             ref={searchRef}
//             value={search}
//             onChange={(e) => {
//               reset();
//               setSearch(e.target.value);
//               onSearchChange?.(e.target.value);
//             }}
//             className="w-full p-2 px-3 py-1 border rounded"
//             placeholder="Search..."
//           />
//         </div>
//       )}

//       <div className="max-h-60 overflow-y-auto">
//         {filteredOptions.length === 0 ? (
//           <div className="px-4 py-2 text-gray-500">No options found</div>
//         ) : (
//           filteredOptions.map((item, index) => (
//             <DropdownItem
//               // key={(item as DropdownOption).value || item}
//               key={typeof item === "string" ? item : item.value}
//               item={item}
//               index={index}
//               updateHighlight={updateHighlight}
//               highlighted={highlightIndexRef.current === index}
//               isSelected={value === ((item as DropdownOption)?.value || item)}
//               register={registerOption(index)}
//               renderItem={renderItem}
//             />
//           ))
//         )}
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default memo(BaseDropdown)