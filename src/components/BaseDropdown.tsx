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

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      removeAction();
      document.removeEventListener("mousedown", handleClickOutside);
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
      onMouseDown={(e) => e.stopPropagation()}
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




// const BaseDropdown: React.FC<BaseDropdownProps> = ({
//   open,
//   options,
//   onSelect,
//   close,
//   renderItem,
//   value,
//   inputRef,
//   dropdownOffset = 0,
//   searchable,
//   onSearchChange,
//   // position,
// }) => {
//   const [search, setSearch] = useState<string>('');
//   const { name, twStyle } = useDropdownContext()
//   const modalRef = useRef<HTMLDivElement>(null)
//   const searchRef = useRef<HTMLInputElement>(null)
//   const { position, calculatePosition } = useDropdownPosition({
//     modalRef: modalRef,
//     fixedRef: inputRef,
//     isOpen: open,
//     dropdownOffset: dropdownOffset
//   })

//   const filteredOptions: (string | DropdownOption)[] = useMemo(() => {
//     if (!search) return options;
//     const lowered = search.toLowerCase();

//     return options.filter((opt) => {
//       const label = (opt as DropdownOption).label.toLowerCase();
//       return label.indexOf(lowered) !== -1;
//     });
//   }, [search, options]);

//   const {
//     highlightIndexRef,
//     handleKeyDown,
//     registerOption,
//     updateHighlight,
//     reset,
//   } = useDropdownNavigation(filteredOptions, close)

//   useLayoutEffect(() => {
//     if (open) {
//       calculatePosition()
//       // reset()
//     }
//   }, [open, options.length])
//   // useEffect(() => {
//   //   if (open) {
//   //     reset()
//   //   }
//   // }, [open, filteredOptions.length])

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     reset()
//     setSearch(e.target.value)
//     onSearchChange?.(e.target.value)
//   }

//   useEffect(() => {
//     if (!options) return;
    
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         inputRef.current &&
//         !inputRef.current.contains(event.target as Node)
//       ) {
//         reset();
//         close();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [options, inputRef]);


//   useEffect(() => {
//     if (!open) return

//     const handler = (e: KeyboardEvent) => {
//       // if (!["Arrow", "Enter", "Escape"].includes(e.code)) return
//       if (
//         !e.code.startsWith("Arrow") &&
//         e.code !== "Enter" &&
//         e.code !== "Escape"
//       ) return
//       // if (!e.code.includes('Arrow') && !e.code.includes('Enter')) return
//       return handleKeyDown(e, onSelect)
//     }

//     window.addEventListener("keydown", handler)
//     return () => window.removeEventListener("keydown", handler)
//   }, [open, options, onSelect])

//   useEffect(() => {
//     if (!open) return;
//     searchRef.current?.focus();

//     const handler = () => calculatePosition();

//     window.addEventListener("resize", handler);
//     window.addEventListener("scroll", handler, true);

//     return () => {
//       window.removeEventListener("resize", handler);
//       window.removeEventListener("scroll", handler, true);
//     };
//   }, [open]);

//   if (!open) return null

//   return (
//     <div
//       ref={modalRef}
//       className={`fixed z-50 ${twStyle.twOptionBoxStyles}`}
//       // className={`fixed z-50 bg-white border rounded-lg shadow-xl ${className}`}
//       style={position}
//       onMouseDown={(e) => e.stopPropagation()}
//     >
//       {searchable && (
//         <div className="p-2 border-b">
//           <input
//             id={`search_${name}`}
//             ref={searchRef}
//             value={search}
//             onChange={(e) => handleSearch(e)}
//             className="w-full p-2 px-3 py-1 border rounded"
//             placeholder="Search..."
//           />
//         </div>
//       )}

//       {position && <div className="max-h-60 overflow-y-auto">
//         {filteredOptions.length === 0 ? (
//           <div className="px-4 py-2 text-gray-500">
//             No options found
//           </div>
//         ) : (
//           filteredOptions.map((item, index) =>
//             <DropdownItem
//               key={typeof item === "string" ? item : item.value}
//               item={item}
//               index={index}
//               updateHighlight={updateHighlight}
//               highlighted={highlightIndexRef.current === index}
//               isSelected={value ? value === ((item as DropdownOption)?.value || item) : false}
//               register={registerOption(index)}
//               renderItem={renderItem}
//             />
//           )
//         )}
//       </div>}
//     </div>
//   )
// }