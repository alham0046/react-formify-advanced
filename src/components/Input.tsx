import { forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef, type ComponentProps } from 'react'
import { useInputStore } from '../hooks/useInputStore'
import type { InputRefProps } from '../typeDeclaration/inputProps'
import { FieldVisualState } from '../Config/FieldVisualState'
import { useFormLayout } from '../context/LabelLayoutContext'
import { useContainerContext } from '../context/ContainerContext'
import { FieldProps, OnBlur, OnEnterPress, OnInputChange } from '../typeDeclaration/baseProps'
import { isArray } from '@/functions/dataTypesValidation'
import { ArrayHelpers } from './ArrayContainer'

type NonEnterKey = Exclude<React.KeyboardEvent<HTMLInputElement>['key'], 'Enter'>

type NonEnterKeyboardEvent =
    Omit<React.KeyboardEvent<HTMLInputElement>, 'key'> & {
        key: NonEnterKey
    }

// export interface OnInputChange {
//     value?: string | number
//     setValue?: (FieldCredentials: FieldProps) => void
// }


interface InputProps {
    onBlur?: OnBlur
    onFocus?: (key: string) => void
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange?: OnInputChange
    // onChange?: (value: string | number) => void
    onEnterPress?: OnEnterPress
    // onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any>, stopPropagation?: () => void }) => void
    onKeyDown?: (e: NonEnterKeyboardEvent) => void
    fixedValue?: string
    refRequired?: boolean
    maxLength?: number
    autoFocus?: boolean
    inputStyles?: string
    disabled: boolean
    placeholder: string
    type: ComponentProps<'input'>['type']
    name: string
    inputInlineStyle?: Omit<
        React.CSSProperties,
        'border' | 'borderWidth'
    >
}
const Input = forwardRef<InputRefProps, InputProps>(({
    name,
    fixedValue,
    maxLength,
    autoFocus = false,
    onBlur,
    onFocus,
    inputStyles = "",
    refRequired = false,
    onKeyDown,
    handleChange,
    onChange,
    onEnterPress,
    disabled,
    placeholder,
    type,
    inputInlineStyle
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { inputStore } = useContainerContext()
    const { labelMode } = useFormLayout()
    const value: string | number = fixedValue ?? useInputStore(name, inputStore) ?? ""
    const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const evalue = e.target.value
        // inputStore.currentValue = evalue
        if (maxLength && evalue.length == maxLength + 1) {
            return
        }
        // inputStore.setValue(name, e.target.value)
        handleChange?.(e)
    }

    useLayoutEffect(() => {
        if (refRequired && inputRef.current) {
            inputStore.setDropdownContext(`ref_${name}`, inputRef)
        }
    }, [inputRef])

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus()
        },
        blur: () => {
            inputRef.current?.blur()
        },
        reset: () => {
            inputStore.reset(name)
        },
        position: () => {
            return inputRef.current?.getBoundingClientRect()
        }
    }))

    // const setValue = (FieldCredentials: FieldProps) => {
    //     const keys = Object.keys(FieldCredentials);
    //     for (const key of keys) {
    //         inputStore.setValue(key, FieldCredentials[key])
    //     }
    // }

    const setValue = (FieldCredentials: FieldProps) => {
        const keys = Object.keys(FieldCredentials);
        for (const key of keys) {
            const value = FieldCredentials[key]
            if (isArray(value)) {
                // inputStore.setSilentValue(key, value)
                inputStore.replaceArray(key, value)
            }
            else {
                inputStore.setValue(key, FieldCredentials[key])
            }
        }
    }

    const arrAction = (path: string) => {
        return {
            add: ({ count, initialValue } = {}) => inputStore.addArrayItem(path, initialValue, count),
            remove: (index) => inputStore.removeArrayItem(path, index),
            pop: () => inputStore.popArrayItem(path),
        } as ArrayHelpers
    }

    const handleBlur = () => {
        inputStore.stylesStore.disable(name, FieldVisualState.Focus)
        const data = inputStore.getSnapshot().inputData
        onBlur?.({ value: value ?? "", data: data as Record<string, any>, setValue })
    }
    const handleFocus = () => {
        inputStore.stylesStore.enable(name, FieldVisualState.Focus)
        onFocus?.(name)
    }

    const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const stopPropagation = () => event.stopPropagation()
        if (event.key === 'Enter') {
            const data = inputStore.getSnapshot().inputData
            onEnterPress?.({
                value: value ?? "",
                data: data as Record<string, any>,
                stopPropagation,
                setValue,
                submit: () => inputStore.triggerSubmit(event)
            })
            return
        }
        onKeyDown?.(event as NonEnterKeyboardEvent)
    }

    useEffect(() => {
        onChange?.({ value, setValue, arrAction })
    }, [value])

    useLayoutEffect(() => {
        if (!inputRef.current) return

        // inputStylesStore.register(name, inputRef.current)
        inputStore.stylesStore.register(name, inputRef.current)

        return () => {
            inputStore.stylesStore.unregister(name)
        }
    }, [name])
    return (
        <>
            <input
                type={type}
                id={`floating_input_${name}`}
                ref={inputRef}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={value}
                maxLength={maxLength}
                autoFocus={autoFocus}
                onKeyDown={handleKeyPresses}
                onChange={handlePreInput}
                style={inputInlineStyle}
                // className={labelMode ? inputStyles : `w-full outline-none rounded-lg input-border bg-transparent appearance-none peer ${inputStyles}`}
                className={labelMode ? inputStyles : `input-border ${inputStyles}`}
                placeholder={labelMode ? placeholder : " "}
                disabled={disabled}
                required
            />
        </>
    )
})

export default memo(Input)
