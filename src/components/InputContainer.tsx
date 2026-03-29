import { type CSSProperties, type FC, type ReactNode, type RefObject, useLayoutEffect, useMemo, useRef } from 'react'
import { memo } from 'react'
import type { FieldVisualState } from '../Config/FieldVisualState';
import { normalizeDefault } from '../Config/configStore';
import { ContainerContext } from '../context/ContainerContext';
import type { InputStyle } from './InputTemplate';
import type { TWInputStyleProp } from '../typeDeclaration/stylesProps';
import { resolveTwStyles } from '../Utils/resolveTwStyles';
import { randomString } from '../functions/stringManiputation';
import { InputStore } from '../store/InputStore';
import { getOrCreateFormStore } from '../store/InputStoreRegistry';
import { DEFAULT_INPUT_STYLE, TW_DEFAULT_INPUT_STYLE } from '../styles/InputStyles';
import { DEFAULT_DROPDOWN_STYLE, TW_DEFAULT_DROPDOWN_STYLE } from '../styles/DropdownStyles';

interface InputContainerProps {
  children: ReactNode;
  style?: CSSProperties
  className?: string
  formId?: string
  mode?: "default" | "edit"
  colorScheme?: FieldVisualState[]
  sharedStyles?: Partial<InputStyle>
  sharedTwStyles?: Partial<TWInputStyleProp>
  modalContainerRef?: RefObject<HTMLDivElement>
}

const InputContainer: FC<InputContainerProps> = ({ children, className, style, formId, sharedStyles, sharedTwStyles, modalContainerRef, colorScheme, mode = "default" }) => {

  const randomId = randomString()

  const id = formId || randomId

  const storeRef = useRef<InputStore>(null)

  if (!storeRef.current) {
    storeRef.current = getOrCreateFormStore(id)
  }

  const containerRef = useRef<HTMLDivElement | null>(null)

  const initialRender = useRef(true)

  if (initialRender.current) {
    storeRef.current.initializeInputStore(mode)
    if (colorScheme) {
      colorScheme.forEach((state: FieldVisualState) => {
        if (typeof state !== "string") return
        const style = normalizeDefault(state)
        if (!style) return
        storeRef.current?.stylesStore.setStyle(state, style)
      })
    }
    initialRender.current = false
  }

  const tw = useMemo(() => {
    if (!sharedTwStyles) return TW_DEFAULT_INPUT_STYLE
    return (resolveTwStyles({
      defaultStyles: TW_DEFAULT_INPUT_STYLE,
      localStyles: sharedTwStyles, // from props
    }))
  }, [sharedTwStyles])

  const resolvedStyle: InputStyle = useMemo(() => {
    if (!sharedStyles) return DEFAULT_INPUT_STYLE
    return {
      ...DEFAULT_INPUT_STYLE,
      ...sharedStyles,
    }
  }, [sharedStyles])

  /**
   * Provide stable context reference
   */
  const contextValue = useMemo(() => ({
    sharedStyles: resolvedStyle,
    sharedDropdownStyles: { ...DEFAULT_DROPDOWN_STYLE, ...resolvedStyle },
    sharedTw: tw,
    sharedDropdownTw: { ...TW_DEFAULT_DROPDOWN_STYLE, ...tw },
    modalContainerRef,
    inputStore: storeRef.current!
  }), [resolvedStyle, tw, modalContainerRef])

  /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
  useLayoutEffect(() => {
    const mainContainerEl = containerRef.current
    if (mainContainerEl instanceof HTMLElement) {
      storeRef.current?.setContainerRef(mainContainerEl)
      let current: HTMLElement | null = mainContainerEl;
      // let backgroundColor: string | null = null;
      let backgroundColor: string = '';

      while (current) {
        const style = window.getComputedStyle(current);
        // const bg = style.backgroundColor;
        backgroundColor = style.backgroundColor;
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
          // backgroundColor = bg
          break; // found non-transparent background
        }
        current = current.parentElement;
      }
      if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') {
        storeRef.current?.setBackgroundColor('white')
      }
      else {
        storeRef.current?.setBackgroundColor(backgroundColor)
      }
    }
    return () => {
      // inputStore.clear()
      storeRef.current?.reset()
    }
  }, []);

  return (
    <ContainerContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        style={style}
        className={className}
      >
        {children}
      </div>
    </ContainerContext.Provider>
  )
}

export default memo(InputContainer)



// style={{
//   ...style,
//   ['--line-bg' as any]: storeRef.current.backgroundColor
// }}

// import React, { FC, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { memo } from 'react'
// import { useInputStore } from '../hooks/useInputStore'
// import { camelCase } from 'src/functions/camelCase';
// import { flattenChildren } from 'src/Utils/flattenChildren';
// import { handleInitialValue } from 'src/Utils/setInitialValue';

// interface InputContainerProps {
//   children: ReactNode;
//   inputContainerStyles?: string;
//   // sharedStyles?: object
//   sharedStyles?: {
//     placeholderStyles?: string
//     inputStyles?: string
//     [key: string]: any
//   }
//   modalContainerRef?: RefObject<HTMLDivElement>
// }

// interface InputChildProps {
//   onInputChange: (modifiedName: string, value: any) => void;
//   [key: string]: any; // optional if child has more props
// }

// const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles, modalContainerRef }) => {
//   const setInputValue = useInputStore((state) => state.setInputValue)

//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const [bgColor, setBgColor] = useState("");

//   const handleInputChange = (modifiedName: string, value: any): void => {
//     setInputValue(modifiedName, value)
//   }
//   const childrenArray = useMemo(() => flattenChildren(children), [children]);

//   /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
//   useEffect(() => {
//     if (containerRef.current instanceof HTMLElement) {
//       let current: HTMLElement | null = containerRef.current;
//       // let backgroundColor: string | null = null;
//       let backgroundColor: string = '';

//       while (current) {
//         const style = window.getComputedStyle(current);
//         // const bg = style.backgroundColor;
//         backgroundColor = style.backgroundColor;
//         if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//           // backgroundColor = bg
//           break; // found non-transparent background
//         }
//         current = current.parentElement;
//       }
//       if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') setBgColor('white')
//       else setBgColor(backgroundColor)
//       // setBgColor(backgroundColor ?? 'white')
//       // setContainerBgColor(backgroundColor || 'white'); // fallback just in case
//     }
//   }, []);

//   return (
//     <div ref={containerRef} className={inputContainerStyles}>
//       {
//         // React.Children.map(children, (child) => {
//         childrenArray.map((child, index) => {
//           if (!React.isValidElement<InputChildProps>(child)) return null;
//           const childType = child.type
//           // const childSafe = child as React.ReactElement<InputChildProps>
//           const isDOMElement = typeof childType === 'string';
//           if (isDOMElement) return child;
//           const childProps = child.props
//           const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
//           if (childProps.placeholder) {
//             handleInitialValue(modifiedName, childProps.initialValue, setInputValue, (childType as any).type.name)
//           }
//           if (React.isValidElement(child)) {
//             return React.cloneElement(child, {
//               key: child.key ?? index,
//               onInputChange: handleInputChange,
//               name: modifiedName,
//               sharedStyles,
//               bgColor,
//               modalContainerRef
//             })
//           }
//           return child
//         })
//       }
//     </div>
//   )
// }

// export default memo(InputContainer)