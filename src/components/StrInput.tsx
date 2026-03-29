import { forwardRef, memo, useEffect } from "react";
import { type InputProps, type InputRefProps } from "../typeDeclaration/inputProps";
import { useComputedExpression } from "../hooks/useComputedExpression";
import InputTemplate from "./InputTemplate";
import { handleInitialValue } from "../Utils/setInitialValue";
import { useFieldName } from "../hooks/useFieldName";
import Input from "./Input";
import { useStyles } from "../hooks/useStylingMods";
import { useContainerContext } from "../context/ContainerContext";


const StrInput = forwardRef<InputRefProps, InputProps>(({...props}, ref) => {
    const {placeholder, name,children,style,twStyle, initialValue="",required=false, disabled=false, hideElement=false, privacy=false, ...rest} = props
    const {inputStore} = useContainerContext()
    const modifiedName = useFieldName(placeholder, name)
    useEffect(() => {
        handleInitialValue(modifiedName, initialValue, inputStore)
    }, [])

    useEffect(() => {
        inputStore.validatorStore.register(modifiedName, {required, validators: []})
    }, [required])


    const {resolvedStyle, tw} = useStyles(style, twStyle!)

    const {boxWidth, containerStyles, inputInlineStyle} = resolvedStyle

    const disabledValue: boolean = useComputedExpression(disabled, modifiedName)

    const hiddenValue: boolean = useComputedExpression(hideElement)

    // const bgColor = inputStore.backgroundColor


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        inputStore.setValue(modifiedName, e.target.value)
    }

    if (hiddenValue) return null

    return (
        <div className={`relative ${tw.twContainerStyles}`} style={{...containerStyles, width: boxWidth}} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            <InputTemplate
                name={modifiedName}
                placeholder={placeholder}
                childType="input"
                style={resolvedStyle}
                // bgColor={bgColor}
                placeholderStyles={tw.twPlaceholderStyles}
            >
                <Input
                    ref={ref}
                    name={modifiedName}
                    placeholder={placeholder}
                    inputInlineStyle={inputInlineStyle}
                    inputStyles={tw.twInputStyles}
                    disabled={disabledValue}
                    type={privacy ? 'password' : 'text'}
                    handleChange={handleChange}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
});

// 1. Export the memoized component
const MemoizedStrInput = memo(StrInput)

// 2. Set the displayName on the exported component
MemoizedStrInput.displayName = 'StrInput';

export default MemoizedStrInput;








// import { forwardRef, memo, useEffect } from "react";
// import { DEFAULT_INPUT_STYLE, type InputProps, type InputRefProps } from "../typeDeclaration/inputProps";
// import { useComputedExpression } from "../hooks/useComputedExpression";
// import { inputStore } from "../store/InputStore";
// import InputTemplate from "./InputTemplate";
// import { handleInitialValue } from "../Utils/setInitialValue";
// import { useFieldName } from "../hooks/useFieldName";


// const StrInput = forwardRef<InputRefProps, InputProps>(({
//     children,
//     placeholder,
//     containerStyles = "",
//     onEnterPress,
//     onBlur,
//     onDisableChange,
//     maxLength,
//     autoFocus = false,
//     privacy = false,
//     disabled = false,
//     hideElement = false,
//     style,
//     inputStyles,
//     placeholderStyles,
//     onChange,
//     initialValue = "",
//     name,
//     ...props
// }, ref) => {
//     const modifiedName = useFieldName(placeholder, name)
//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue)
//     }, [])

//     const disabledValue: boolean = useComputedExpression(disabled, modifiedName)

//     const hiddenValue: boolean = useComputedExpression(hideElement)


//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         inputStore.setValue(modifiedName, e.target.value)
//     }

//     if (hiddenValue) return null

//     return (
//         <div className={containerStyles} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
//             <InputTemplate
//                 ref={ref}
//                 name={modifiedName}
//                 onChange={onChange}
//                 // value={value}
//                 handleChange={handleChange}
//                 onEnterPress={onEnterPress}
//                 style={style}
//                 // style={{
//                 //     ...DEFAULT_INPUT_STYLE,
//                 //     ...style
//                 // }}
//                 disabled={disabledValue}
//                 onBlur={onBlur}
//                 autoFocus={autoFocus}
//                 maxLength={maxLength}
//                 placeholder={placeholder}
//                 type={privacy ? 'password' : 'text'}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 // {...props}
//             />
//             {children}
//         </div>
//     );
// });

// // 1. Export the memoized component
// const MemoizedStrInput = memo(StrInput)

// // 2. Set the displayName on the exported component
// MemoizedStrInput.displayName = 'StrInput';

// export default MemoizedStrInput;





















// import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
// import { useInputStore } from 'src/hooks/useInputStore';
// import InputTemplate from './InputTemplate';
// import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
// import { getNestedValue } from 'src/Utils/inputStoreUtils';
// import { useComputedExpression } from 'src/hooks/useComputedExpression';
// import { useFormInitials } from 'src/hooks/useFormInitialState';


// const StrInput: FC<InputProps> = ({
//     placeholder,
//     containerStyles = "",
//     onEnterPress = () => { },
//     onBlur = () => { },
//     onDisableChange,
//     maxLength,
//     privacy = false,
//     disabled = false,
//     hideElement = false,
//     inputStyles,
//     placeholderStyles,
//     onChange = () => { },
//     initialValue = "",
//     name,
//     ...props
// }) => {
//     const fullProps = props as FullInputProps

//     const value: string = useInputStore(
//         (state) => {
//             if (fullProps.isArrayObject) {
//                 const arrData = fullProps.arrayData!;
//                 return (
//                     state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name!] ?? ""
//                 );
//             }
//             return getNestedValue(state.inputData, name!) ?? ""
//             // return state.inputData[name] ?? "";
//         }
//     );
    
//     const handleOnDisableChange = useCallback((value: any) => {
//         useFormInitials({ [name!]: value })
//     }, [name])

//     const disabledValue: boolean = useComputedExpression(disabled, name!)

//     const hiddenValue: boolean = useComputedExpression(hideElement, name!)


//     useEffect(() => {
//         if (onDisableChange) {
//             const { inputData } = useInputStore.getState()
//             const currentDisabled = getNestedValue(inputData, name)
//             onDisableChange({
//                 state: disabledValue,
//                 disabledKey: name,
//                 disabledValue: currentDisabled,
//                 storeValue: inputData,
//                 setValue: handleOnDisableChange
//             })
//         }
//     }, [disabledValue])

//     const prevValueRef = useRef(value)

//     useEffect(() => {
//         if (value !== prevValueRef.current) {
//             prevValueRef.current = value
//             if (value !== "") {
//                 onChange(value, null)  // Pass null as no event.data
//             }
//         }
//     }, [value])

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const changedValue = e.target.value;
//         const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
//         onChange(changedValue, nativeEvent.data);
//         fullProps.onInputChange(name!, e.target.value);
//     }

//     return (
//         <div style={{ display: hiddenValue ? 'none' : 'block' }}>
//             <InputTemplate
//                 name={name!}
//                 value={value}
//                 handleChange={handleChange}
//                 onEnterPress={onEnterPress}
//                 disabled={disabledValue}
//                 hideElement={hiddenValue}
//                 onBlur={onBlur}
//                 maxLength={maxLength}
//                 placeholder={placeholder}
//                 type={privacy ? 'password' : 'text'}
//                 containerStyles={containerStyles}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 {...props}
//             />
//         </div>
//     );
// };

// // 1. Export the memoized component
// const MemoizedStrInput = memo(StrInput)

// // 2. Set the displayName on the exported component
// MemoizedStrInput.displayName = 'StrInput';

// export default MemoizedStrInput;