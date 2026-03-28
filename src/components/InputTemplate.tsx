import React, { type CSSProperties, type FC, memo } from 'react'
import { useFormLayout } from '../context/LabelLayoutContext'

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

interface TemplateProps {
    name: string
    children: React.ReactNode
    childType: 'input' | 'dropdown'
    placeholder: string
    // style?: Partial<InputStyle>
    style: Partial<InputStyle>
    placeholderStyles?: string
}

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

const InputTemplate : FC<TemplateProps> = ({
    name,
    children,
    placeholder,
    childType,
    style,
    placeholderStyles = "",
}) => {
    const { borderWidth, boxHeight, placeHolderOffset, placeholderInlineStyle } = style
    const { labelMode } = useFormLayout()
    return (
        <div
            className={`relative w-full group input-root`} /* onFocus={() => setFocusInputKey(name)} */
            style={{ ['--bw' as any]: borderWidth, ['--bh' as any]: boxHeight, ['--po' as any]: placeHolderOffset, ['--float' as any]: childType === 'dropdown' ? 1 : 0, }}
        >
            {/* {console.log('thev valueof ', name)} */}
            {children}
            {!labelMode && <label
                id={`floating_input_${name}`}
                htmlFor={`floating_input_${name}`}
                className={`
                            label-input h-full
                          `}
            >
                {/* BORDER CUT MASK */}
                <span
                    className={`line-input`}
                />

                {/* TEXT */}
                <span className={`placeholder-input h-full ${placeholderStyles}`} style={placeholderInlineStyle}>{placeholder}</span>
            </label>}
        </div>
    )
}

export default memo(InputTemplate)




// import React, { type ComponentProps, forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
// import { inputStore } from '../store/InputStore'
// import { DEFAULT_INPUT_STYLE, type InputRefProps } from '../typeDeclaration/inputProps'
// import { inputStylesStore } from '../InputStyles'
// import { FieldVisualState } from '../Config/FieldVisualState'
// import { useInputStore } from '../hooks/useInputStore'
// import { useFormLayout } from '../context/LabelLayoutContext'
// import { useContainerContext } from '../context/ContainerContext'

// export interface InputStyle {
//     borderWidth: number | string
//     boxHeight: number | string
//     boxWidth: number | string
//     placeHolderOffset: number | string
//     /* visuals only */
//     inputInlineStyle?: Omit<
//         React.CSSProperties,
//         'border' | 'borderWidth'
//     >
//     placeholderInlineStyle?: React.CSSProperties
// }

// interface FullTemplateProps {
//     name: string
//     children: React.ReactNode
//     type: ComponentProps<'input'>['type']
//     fixedValue?: string
//     placeholder: string
//     // borderWidth: number | string
//     autoFocus?: boolean
//     maxLength?: number
//     onChange?: (value: string | number) => void
//     onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
//     onFocus?: (key: string) => void
//     onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
//     disabled: boolean
//     // value: string | number
//     handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     style?: Partial<InputStyle>
//     inputStyles?: string
//     placeholderStyles?: string
//     // sharedStyles?: {
//     //     placeholderStyles?: string
//     //     [key: string]: any
//     // }
// }

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

// const InputTemplate = forwardRef<InputRefProps, TemplateProps>(({
//     name,
//     children,
//     type,
//     placeholder,
//     maxLength,
//     fixedValue,
//     onChange,
//     // borderWidth,
//     // value,
//     onBlur,
//     autoFocus,
//     onEnterPress,
//     onFocus,
//     disabled = false,
//     handleChange = () => { },
//     style,
//     inputStyles = "",
//     placeholderStyles = "",
// }, ref) => {
//     // const setFocusInputKey = useInputStore((state) => state.setCurrentInputKey);
//     const { sharedStyles } = useContainerContext()
//     const resolvedStyle: InputStyle = {
//         ...DEFAULT_INPUT_STYLE,
//         ...sharedStyles,
//         ...style, // 👈 highest priority
//     }

//     const { borderWidth, boxHeight, boxWidth, placeHolderOffset, inputInlineStyle, placeholderInlineStyle } = resolvedStyle
//     const inputRef = useRef<HTMLInputElement>(null)
//     const { labelMode } = useFormLayout()
//     const bgColor = inputStore.backgroundColor
//     const value: string | number = fixedValue ?? useInputStore(name) ?? ""
//     const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         console.log('the string value is', e.target.value)
//         const evalue = e.target.value
//         // inputStore.currentValue = evalue
//         if (maxLength && evalue.length == maxLength + 1) {
//             return
//         }
//         // inputStore.setValue(name, e.target.value)
//         handleChange(e)
//     }

//     useImperativeHandle(ref, () => ({
//         focus: () => {
//             inputRef.current?.focus()
//         },
//         blur: () => {
//             inputRef.current?.blur()
//         },
//         reset: () => {
//             inputStore.reset()(name)
//         }
//     }))


//     const handleBlur = () => {
//         // console.log('blurred')
//         inputStylesStore.disable(name, FieldVisualState.Focus)
//         const data = inputStore.getSnapshot()
//         onBlur?.({ currentValue: value ?? "", allData: data as Record<string, any> })
//     }
//     const handleFocus = () => {
//         inputStylesStore.enable(name, FieldVisualState.Focus)
//         // console.log('blurred')
//         onFocus?.(name)
//     }
//     const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             console.log('enter pressed')
//             const data = inputStore.getSnapshot()
//             onEnterPress?.({ currentValue: value ?? "", allData: data as Record<string, any> })
//         }
//     }

//     useEffect(() => {
//         onChange?.(value)
//     }, [value])

//     useLayoutEffect(() => {
//         if (!inputRef.current) return

//         inputStylesStore.register(name, inputRef.current)

//         return () => {
//             inputStylesStore.unregister(name)
//         }
//     }, [name])
//     return (
//         <div
//             className={`relative w-full group input-root`} /* onFocus={() => setFocusInputKey(name)} */
//             style={{ ['--bw' as any]: borderWidth, ['--bh' as any]: boxHeight, ['--po' as any]: placeHolderOffset }}
//         >
//             {/* <div className="absolute inset-0 rounded-lg input-border pointer-events-none" /> */}
//             {/* {console.log('thev valueof ', name, placeholder, style)} */}
//             <input
//                 type={type}
//                 id={`floating_input_${name}`}
//                 ref={inputRef}
//                 onBlur={handleBlur}
//                 onFocus={handleFocus}
//                 value={value}
//                 maxLength={maxLength}
//                 autoFocus={autoFocus}
//                 onKeyDown={handleKeyPresses}
//                 onChange={handlePreInput}
//                 style={inputInlineStyle}
//                 className={labelMode ? inputStyles : `w-full outline-none rounded-lg input-border bg-transparent appearance-none peer ${inputStyles}`}
//                 placeholder={labelMode ? placeholder : " "}
//                 disabled={disabled}
//                 required
//             />
//             {children}
//             {!labelMode && <label
//                 id={`floating_input_${name}`}
//                 htmlFor={`floating_input_${name}`}
//                 className={`
//                             label-input h-full
//                           `}
//             >
//                 {/* BORDER CUT MASK */}
//                 <span
//                     className="line-input"
//                     style={{
//                         backgroundColor: bgColor || 'white',
//                     }}
//                 />

//                 {/* TEXT */}
//                 <span className={`placeholder-input h-full ${placeholderStyles}`} style={placeholderInlineStyle}>{placeholder}</span>
//             </label>}
//         </div>
//     )
// })

// export default memo(InputTemplate)


























// peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-0
//                             peer-focus:-translate-y-1/2



// import React, { type ComponentProps, forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
// import { inputStore } from '../store/InputStore'
// import type { InputRefProps } from '../typeDeclaration/inputProps'
// import { inputStylesStore } from '../InputStyles'
// import { FieldVisualState } from '../Config/FieldVisualState'
// import { useInputStore } from '../hooks/useInputStore'
// import { useFormLayout } from '../context/LabelLayoutContext'

// interface FullTemplateProps {
//     name: string
//     type: ComponentProps<'input'>['type']
//     fixedValue?: string
//     placeholder: string
//     autoFocus?: boolean
//     maxLength?: number
//     onChange?: (value: string | number) => void
//     onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
//     onFocus?: (key: string) => void
//     onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
//     disabled?: boolean
//     hideElement?: boolean
//     // value: string | number
//     handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     containerStyles?: string
//     inputStyles?: string
//     placeholderStyles?: string
//     // bgColor: string
//     sharedStyles?: {
//         placeholderStyles?: string
//         [key: string]: any
//     }
// }

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

// const InputTemplate = forwardRef<InputRefProps, TemplateProps>(({
//     name,
//     type,
//     placeholder,
//     maxLength,
//     fixedValue,
//     onChange,
//     // value,
//     onBlur,
//     autoFocus,
//     onEnterPress,
//     onFocus,
//     disabled = false,
//     hideElement = false,
//     handleChange = () => { },
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     ...props
// }, ref) => {
//     // const setFocusInputKey = useInputStore((state) => state.setCurrentInputKey);
//     const pattern = /border-(\d+|\[([^\]]+)\])/
//     // const {} = u
//     const inputRef = useRef<HTMLInputElement>(null)
//     const {labelMode} = useFormLayout() ?? false
//     const match = inputStyles.match(pattern)
//     const dynamicHeight = match ? (match[2] ? match[2] : `${match[1]}px`) : undefined;
//     const labelRef = useRef<any>("")
//     const bgColor = inputStore.backgroundColor
//     const value: string | number = fixedValue ?? useInputStore(name) ?? ""
//     const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         console.log('the string value is', e.target.value)
//         const evalue = e.target.value
//         // inputStore.currentValue = evalue
//         if (maxLength && evalue.length == maxLength + 1) {
//             return
//         }
//         // inputStore.setValue(name, e.target.value)
//         handleChange(e)
//     }

//     useImperativeHandle(ref, () => ({
//         focus: () => {
//             inputRef.current?.focus()
//         },
//         blur: () => {
//             inputRef.current?.blur()
//         },
//         reset: () => {
//             inputStore.reset()(name)
//         }
//     }))

//     const hasValue = value !== ""


//     const handleBlur = () => {
//         // console.log('blurred')
//         inputStylesStore.disable(name, FieldVisualState.Focus)
//         const data = inputStore.getSnapshot()
//         onBlur?.({ currentValue: value ?? "", allData: data as Record<string, any> })
//     }
//     const handleFocus = () => {
//         inputStylesStore.enable(name, FieldVisualState.Focus)
//         // console.log('blurred')
//         onFocus?.(name)
//     }
//     const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             console.log('enter pressed')
//             const data = inputStore.getSnapshot()
//             onEnterPress?.({ currentValue: value ?? "", allData: data as Record<string, any> })
//         }
//     }
//     const [labelWidth, setLabelWidth] = useState<number | null>(null);

//     useEffect(() => {
//         onChange?.(value)
//     }, [value])


//     useLayoutEffect(() => {
//         if (labelRef.current) {
//             // console.log('logging layout')
//             setLabelWidth(labelRef.current.offsetWidth);
//         }
//     }, [placeholder, hideElement]);

//     useLayoutEffect(() => {
//         if (!inputRef.current) return

//         inputStylesStore.register(name, inputRef.current)

//         return () => {
//             inputStylesStore.unregister(name)
//         }
//     }, [name])
//     return (
//         <div
//             className={`relative w-full group`} /* onFocus={() => setFocusInputKey(name)} */
//         >
//             {/* {console.log('thev valueof ', name, placeholder, value)} */}
//             <input
//                 type={type}
//                 id={`floating_input_${name}`}
//                 ref={inputRef}
//                 onBlur={handleBlur}
//                 onFocus={handleFocus}
//                 value={value}
//                 maxLength={maxLength}
//                 autoFocus={autoFocus}
//                 onKeyDown={handleKeyPresses}
//                 onChange={handlePreInput}
//                 className={labelMode ? inputStyles : `px-2 w-full border outline-none rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
//                 placeholder={labelMode ? placeholder : " "}
//                 disabled={disabled}
//                 required
//             />
//             {labelWidth && !labelMode && (
//                 <div
//                     className='absolute top-0 left-4 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 transition-opacity duration-200'
//                     style={{
//                         height: dynamicHeight || 2,
//                         width: labelWidth! * 0.75 + 8,
//                         backgroundColor: bgColor || 'white'
//                     }}
//                 />
//             )}
//             {!labelMode && <label
//                 ref={labelRef}
//                 id={`floating_input_${name}`}
//                 htmlFor={`floating_input_${name}`}
//                 className={`
//                             absolute left-5 h-full duration-300 flex items-center origin-left
//                             ${hasValue ? 'scale-75 -translate-y-1/2 top-0' : ''}
//                             peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-0
//                             peer-focus:scale-75 peer-focus:-translate-y-1/2
//                             ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''} ${placeholderStyles}
//                           `}
//             >
//                 {placeholder}
//             </label>}
//         </div>
//     )
// })

// export default memo(InputTemplate)































// import React, { ComponentProps, memo, useLayoutEffect, useRef, useState } from 'react'
// import { useInputStore } from 'src/hooks/useInputStore'
// import { inputStore } from 'src/InputStore'

// interface FullTemplateProps {
//     name: string
//     type: ComponentProps<'input'>['type']
//     placeholder: string
//     maxLength?: number
//     onBlur?: (args: { currentValue: string, allData: Record<string, any> }) => void
//     onEnterPress?: (args: { currentValue: string, allData: Record<string, any> }) => void
//     disabled?: boolean
//     hideElement?: boolean
//     value: string
//     handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     containerStyles?: string
//     inputStyles?: string
//     placeholderStyles?: string
//     // bgColor: string
//     sharedStyles?: {
//         placeholderStyles?: string
//         [key: string]: any
//     }
// }

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

// const InputTemplate: React.FC<TemplateProps> = ({
//     name,
//     type,
//     placeholder,
//     maxLength,
//     value,
//     onBlur = () => { },
//     onEnterPress = () => { },
//     disabled = false,
//     hideElement = false,
//     handleChange = () => { },
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     ...props
// }) => {
//     const setFocusInputKey = useInputStore((state) => state.setCurrentInputKey);
//     const pattern = /border-(\d+|\[([^\]]+)\])/
//     const match = inputStyles.match(pattern)
//     const dynamicHeight = match ? (match[2] ? match[2] : `${match[1]}px`) : undefined;
//     const labelRef = useRef<any>("")
//     const bgColor = inputStore.backgroundColor
//     const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const evalue = e.target.value
//         if (maxLength && evalue.length == maxLength + 1) {
//             return
//         }
//         handleChange(e)
//     }
//     const handleBlur = () => {
//         const { inputData: data } = useInputStore.getState()
//         onBlur({currentValue : value, allData : data})
//     }
//     const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             const { inputData: data } = useInputStore.getState()
//             onEnterPress({currentValue : value, allData : data})
//         }
//     }
//     const [labelWidth, setLabelWidth] = useState<number | null>(null);

//     useLayoutEffect(() => {
//         if (labelRef.current) {
//             setLabelWidth(labelRef.current.offsetWidth);
//         }
//     }, [value, placeholder, hideElement]);
//     return (
//         <div className={`relative w-full group ${containerStyles}`} onFocus={() => setFocusInputKey(name)}>
//             {/* {console.log('thev valueof ', placeholder, type)} */}
//             <input
//                 type={type}
//                 id={`floating_input_${name}`}
//                 onBlur={handleBlur}
//                 value={value}
//                 maxLength={maxLength}
//                 onKeyDown={handleKeyPresses}
//                 onChange={handlePreInput}
//                 className={`py-2 px-2 border-2 w-full outline-none rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
//                 placeholder=" "
//                 disabled={disabled}
//                 required
//             />
//             {labelWidth && (
//                 <div
//                     className='absolute top-0 left-4 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 transition-opacity duration-200'
//                     style={{
//                         height: dynamicHeight || 2,
//                         width: labelWidth * 0.75 + 8,
//                         backgroundColor: bgColor || 'white'
//                     }}
//                 />
//             )}
//             <label
//                 ref={labelRef}
//                 htmlFor={`floating_input_${name}`}
//                 className={`
//                     absolute left-5 duration-300 transform -translate-y-5 scale-75 top-2 origin-left
//                     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
//                     peer-focus:scale-75 peer-focus:-translate-y-5
//                     ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''} ${placeholderStyles}
//                     `}
//             >
//                 {placeholder}
//             </label>
//         </div>
//     )
// }

// export default memo(InputTemplate)