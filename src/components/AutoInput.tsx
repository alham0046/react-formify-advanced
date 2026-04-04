import React, { memo, useMemo } from 'react'
import { camelCase, fromCamelCase } from '../functions/camelCase';
import { isArray, isPlainObject } from '../functions/dataTypesValidation';
import StrInput from './StrInput';
import NumInput from './NumInput';
import ArrayContainer from './ArrayContainer';
import ObjectContainer from './ObjContainer';
import { useNameScope } from '../context/NameScopeContext';
import type { InputProps } from '../typeDeclaration/inputProps';
import { useContainerContext } from '../context/ContainerContext';

interface FullAutoInputProps {
    initialData?: object
    exclusionKeys?: string | string[]
    onInputChange?: () => void
    sharedStyles?: object
    name?: undefined
    bgColor?: string
}

type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">

const AutoInput: React.FC<AutoInputProps> = ({ initialData, exclusionKeys }) => {
    const scope = useNameScope()?.parent
    const {inputStore} = useContainerContext()
    const excludedKeys = useMemo(() => {
        if (!exclusionKeys) return [];
        return isArray(exclusionKeys)
            ? exclusionKeys.map(camelCase)
            : [camelCase(exclusionKeys)];
    }, [exclusionKeys]);
    const inputFields = useMemo(() => {
        return initialData ?? inputStore.getSnapshot().inputData;
    }, [initialData]);
    if (!inputFields) return null

    const renderField = (
        key: string,
        value: any,
        scope?: string
    ): React.ReactNode => {
        const modifiedKey = scope ? `${scope}.${key}` : key
        const commonProps : InputProps = {
            initialValue: value,
            name: key,
            placeholder: fromCamelCase(key),
        }

        // primitive
        if (typeof value === 'string') {
            return <StrInput key={modifiedKey} {...commonProps} />
        }

        if (typeof value === 'number') {
            return <NumInput key={modifiedKey} {...commonProps} />
        }

        // array
        if (isArray(value)) {
            return (
                <ArrayContainer
                    key={key}
                    name={key}
                    repeat={value.length}
                    getKey={(_, i) => `${modifiedKey}.${i}`}
                >
                    {({index}) => (
                        <AutoInput initialData={value[index]} />
                    )}
                </ArrayContainer>
            )
        }

        // object
        if (isPlainObject(value)) {
            return (
                <ObjectContainer key={modifiedKey} name={key}>
                    <AutoInput initialData={value} />
                </ObjectContainer>
            )
        }

        return null
    }

    return (
        <>
            {
                Object.entries(inputFields).map(([key, value]) => {
                    if (excludedKeys.includes(key)) return null;

                    return renderField(key, value, scope)
                })
            }
        </>
    )
}

const MemoizedAutoInput = memo(AutoInput)

MemoizedAutoInput.displayName = 'AutoInput';

export default MemoizedAutoInput;












// import React, { memo, useMemo } from 'react'
// import { camelCase, fromCamelCase } from '../functions/camelCase';
// import { isArray, isPlainObject } from '../functions/dataTypesValidation';
// import StrInput from './StrInput';
// import NumInput from './NumInput';
// import ArrayContainer from './ArrayContainer';
// import ObjectContainer from './ObjContainer';
// import { useNameScope } from '../context/NameScopeContext';
// import type { InputProps } from '../typeDeclaration/inputProps';
// import { useContainerContext } from '../context/ContainerContext';

// interface FullAutoInputProps {
//     initialData?: object
//     exclusionKeys?: string | string[]
//     onInputChange?: () => void
//     sharedStyles?: object
//     name?: undefined
//     bgColor?: string
// }

// type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">

// const AutoInput: React.FC<AutoInputProps> = ({ initialData, exclusionKeys }) => {
//     // const setInputValue = useInputStore((state) => state.setInputValue)
//     // const { name, ...rest } = props
//     const scope = useNameScope() ?? ''
//     const {inputStore} = useContainerContext()
//     const excludedKeys = useMemo(() => {
//         if (!exclusionKeys) return [];
//         return isArray(exclusionKeys)
//             ? exclusionKeys.map(camelCase)
//             : [camelCase(exclusionKeys)];
//     }, [exclusionKeys]);
//     const inputFields = useMemo(() => {
//         return initialData ?? inputStore.getSnapshot().inputData;
//     }, [initialData]);
//     if (!inputFields) return null

//     const renderField = (
//         key: string,
//         value: any,
//         scope: string
//     ): React.ReactNode => {
//         const modifiedKey = scope ? `${scope}.${key}` : key
//         const commonProps : InputProps = {
//             initialValue: value,
//             name: key,
//             placeholder: fromCamelCase(key),
//         }

//         // primitive
//         if (typeof value === 'string') {
//             return <StrInput key={modifiedKey} {...commonProps} />
//         }

//         if (typeof value === 'number') {
//             return <NumInput key={modifiedKey} {...commonProps} />
//         }

//         // array
//         if (Array.isArray(value)) {
//             return (
//                 <ArrayContainer
//                     key={key}
//                     name={key}
//                     items={value}
//                     getKey={(_, i) => `${modifiedKey}.${i}`}
//                 >
//                     {(item) => (
//                         <AutoInput initialData={item} />
//                     )}
//                 </ArrayContainer>
//             )
//         }

//         // object
//         if (isPlainObject(value)) {
//             return (
//                 <ObjectContainer key={modifiedKey} name={key}>
//                     <AutoInput initialData={value} />
//                 </ObjectContainer>
//             )
//         }

//         return null
//     }

//     return (
//         <>
//             {
//                 Object.entries(inputFields).map(([key, value]) => {
//                     if (excludedKeys.includes(key)) return null;

//                     return renderField(key, value, scope)
//                 })
//             }
//         </>
//     )
// }

// // 1. Export the memoized component
// const MemoizedAutoInput = memo(AutoInput)

// // 2. Set the displayName on the exported component
// MemoizedAutoInput.displayName = 'AutoInput';

// export default MemoizedAutoInput;

// // export default memo(AutoInput)


























// import React, { memo, useEffect, useMemo, useState } from 'react'
// import { camelCase, fromCamelCase } from '../functions/camelCase';
// import { isArray } from '../functions/dataTypesValidation';
// import StrInput from './StrInput';
// import NumInput from './NumInput';
// import { inputStore } from '../InputStore';
// interface mongoProps {
//     key: string
//     value: string | number
// }

// interface FullAutoInputProps {
//     initialData?: object
//     exclusionKeys?: string | string[]
//     onInputChange?: () => void
//     sharedStyles?: object
//     name?: undefined
//     bgColor? : string
// }

// type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">

// const AutoInput: React.FC<AutoInputProps> = ({ initialData, exclusionKeys, ...props }) => {
//     // const setInputValue = useInputStore((state) => state.setInputValue)
//     const { name, ...rest } = props
//     const excludedKeys = useMemo(() => {
//         if (!exclusionKeys) return [];
//         return isArray(exclusionKeys)
//             ? exclusionKeys.map(camelCase)
//             : [camelCase(exclusionKeys)];
//     }, [exclusionKeys]);
//     const inputFields = useMemo<mongoProps[]>(() => {
//         const data = initialData ?? inputStore.getSnapshot().inputData;

//         if (!data) return [];

//         if (!initialData) return Object.entries(data).map(([key, value]) => ({ key, value }));

//         // Also set the data in store when `initialData` is present
//         const normalized = Object.fromEntries(
//             Object.entries(initialData).map(([key, val]) => [key, val === 0 ? "" : val])
//         );
//         // useInputStore.getState().setInitialInputData(normalized);
//         inputStore.setInitialData(normalized)

//         return Object.entries(normalized).map(([key, value]) => ({ key, value }));
//     }, [initialData]);
//     return (
//         <>
//             {
//                 inputFields.map(({ key, value }) => {
//                     if (excludedKeys.includes(key)) return null;

//                     const commonProps = {
//                         name: key,
//                         placeholder: fromCamelCase(key),
//                         sharedStyles: (props as FullAutoInputProps).sharedStyles,
//                         bgColor: (props as FullAutoInputProps).bgColor,
//                         ...rest
//                     };

//                     return typeof value === "number" ? (
//                         <NumInput key={key} {...commonProps} />
//                     ) : (
//                         <StrInput key={key} {...commonProps} />
//                     );
//                 })
//             }
//         </>
//     )
// }

// // 1. Export the memoized component
// const MemoizedAutoInput = memo(AutoInput)

// // 2. Set the displayName on the exported component
// MemoizedAutoInput.displayName = 'AutoInput';

// export default MemoizedAutoInput;

// // export default memo(AutoInput)
