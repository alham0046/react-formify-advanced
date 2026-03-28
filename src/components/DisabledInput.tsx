import { type FC, memo, useEffect } from 'react';
import InputTemplate, { type InputStyle } from './InputTemplate';
import { useFieldName } from '../hooks/useFieldName';
import { handleInitialValue } from '../Utils/setInitialValue';
import { useComputedExpression } from '../hooks/useComputedExpression';
import Input from './Input';
import { useContainerContext } from '../context/ContainerContext';
import type { TWInputStyleProp } from '../typeDeclaration/stylesProps';
import { useStyles } from '../hooks/useStylingMods';
import { OnInputChange } from '@/typeDeclaration/baseProps';

interface DisabledInputProps {
    initialValue?: string;
    children?: React.ReactNode
    placeholder: string;
    style?: Partial<InputStyle>
    twStyle?: Partial<TWInputStyleProp>
    privacy?: boolean
    hideElement?: boolean | string
    onChange?: OnInputChange
    name?: string;
}


const DisabledInput: FC<DisabledInputProps> = ({
    initialValue = "",
    privacy = false,
    children,
    style,
    twStyle,
    placeholder,
    hideElement = false,
    name,
    ...rest
}) => {
    const modifiedName = useFieldName(placeholder, name)

    const { inputStore } = useContainerContext()

    useEffect(() => {
        handleInitialValue(modifiedName, initialValue, inputStore, true)
    }, [])

    const { resolvedStyle, tw } = useStyles(style, twStyle!)

    const { boxWidth, containerStyles, inputInlineStyle } = resolvedStyle

    const hiddenValue: boolean = useComputedExpression(hideElement)

    if (hiddenValue) {
        return null;
    }


    return (
        <div className={`relative ${tw.twPlaceholderStyles}`} style={{...containerStyles, width: boxWidth}} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={modifiedName}
                placeholder={placeholder}
                style={resolvedStyle}
                childType='input'
                placeholderStyles={tw.twPlaceholderStyles}
            >
                <Input
                    name={modifiedName}
                    placeholder={placeholder}
                    inputInlineStyle={inputInlineStyle}
                    inputStyles={tw.twInputStyles}
                    disabled={true}
                    type={privacy ? 'password' : 'text'}
                    fixedValue={initialValue}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
};

// 1. Export the memoized component
const MemoizedDisabledInput = memo(DisabledInput)

// 2. Set the displayName on the exported component
MemoizedDisabledInput.displayName = 'DisabledInput';

export default MemoizedDisabledInput;





// import { type FC, forwardRef, memo, useEffect } from 'react';
// import InputTemplate from './InputTemplate';
// import { useFieldName } from '../hooks/useFieldName';
// import { handleInitialValue } from '../Utils/setInitialValue';
// import type { InputRefProps } from '../typeDeclaration/inputProps';
// import { useComputedExpression } from '../hooks/useComputedExpression';

// interface FullDisabledProps {
//     initialValue?: string;
//     containerStyles?: string;
//     inputStyles?: string;
//     placeholderStyles?: string;
//     placeholder: string;
//     borderWidth?: number | string
//     hideElement?: false
//     onChange?: (value: string | number) => void
//     name?: string;
//     isArrayObject?: boolean;
//     arrayData?: {
//         arrayName: string;
//         arrayIndex: number;
//     };
//     onInputChange: (name: string, value: string) => void;
// }

// type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;

// const DisabledInput: FC<DisabledInputProps> = ({
//     initialValue = "",
//     containerStyles = "",
//     placeholder,
//     borderWidth = 1,
//     hideElement = false,
//     onChange = () => { },
//     inputStyles,
//     placeholderStyles,
//     name,
//     ...props
// }) => {
//     const modifiedName = useFieldName(placeholder, name)

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue, true)
//     }, [])

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     // const value = useInputStore(modifiedName)

//     // useEffect(() => {
//     //     onChange(initialValue, null)
//     //     // inputStore.setValue(modifiedName, initialValue);
//     // }, [modifiedName]);
//     if (hiddenValue) {
//         return null;
//     }

//     return (
//         <>
//             <InputTemplate
//                 name={modifiedName}
//                 borderWidth={borderWidth}
//                 placeholder={placeholder}
//                 fixedValue={initialValue}
//                 // onChange={onChange}
//                 disabled={true}
//                 type='text'
//                 containerStyles={containerStyles}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//             // {...props}
//             />
//         </>
//     );
// };

// // 1. Export the memoized component
// const MemoizedDisabledInput = memo(DisabledInput)

// // 2. Set the displayName on the exported component
// MemoizedDisabledInput.displayName = 'DisabledInput';

// export default MemoizedDisabledInput;
















// export default memo(DisabledInput);
{/* <input
    type="text"
    id={`floating_input_${modifiedName}`}
    value={value}
    className="py-2 px-2 border-2 w-full rounded-lg bg-transparent appearance-none peer"
    placeholder=" "
    required
    disabled
/>
<label
    htmlFor={`floating_input_${modifiedName}`}
    className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
>
    {placeholder}
</label> */}