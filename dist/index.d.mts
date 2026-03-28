import * as React$1 from 'react';
import React__default, { CSSProperties, ReactNode, ReactElement, MouseEvent, RefObject } from 'react';

interface InputStyle {
    borderWidth: number | string;
    boxHeight: number | string;
    boxWidth: number | string;
    placeHolderOffset: number | string;
    containerStyles: CSSProperties;
    inputInlineStyle?: Omit<React__default.CSSProperties, 'border' | 'borderWidth'>;
    placeholderInlineStyle?: React__default.CSSProperties;
}

interface DropdownStyleProp {
    dropdownOffset: number;
    selectedStyles: CSSProperties;
    highlightedStyles: CSSProperties;
    modalBoxStyles: CSSProperties;
    optionBoxStyles: CSSProperties;
    optionStyles: CSSProperties;
}
interface TWDropdownStyleProp {
    twSelectedStyles: string;
    twHighlightedStyles: string;
    twModalBoxStyles: string;
    twOptionBoxStyles: string;
    twOptionItemStyles: string;
}
interface TWInputStyleProp {
    twInputStyles: string;
    twPlaceholderStyles: string;
    twContainerStyles: string;
}

interface BaseInputProps<T = {}, U = {}> {
    placeholder: string;
    children?: React.ReactNode;
    initialValue?: string;
    twStyle?: Partial<TWInputStyleProp & T>;
    style?: Partial<InputStyle & U>;
    disabled?: string | boolean;
    hideElement?: string | boolean;
    onEnterPress?: OnEnterPress;
    onBlur?: OnBlur;
    name?: string;
    onChange?: OnInputChange;
    onDisableChange?: (args: {
        state: boolean;
        disabledKey?: string;
        disabledValue: any;
        storeValue: Record<string, any> | null;
        setValue: (value: any) => void;
    }) => void;
}
interface OnInputChangeArgs {
    value: string | number;
    setValue: (field: FieldProps) => void;
}
type OnInputChange = (args: OnInputChangeArgs) => void;
interface onEnterPressArgs extends OnInputChangeArgs {
    stopPropagation: () => void;
    data: Record<string, any>;
}
type OnEnterPress = (args: onEnterPressArgs) => void;
interface OnBlurArgs extends OnInputChangeArgs {
    data: Record<string, any>;
}
type OnBlur = (args: OnBlurArgs) => void;
interface FieldProps {
    [key: string]: any;
}

interface FullInputProps extends BaseInputProps {
    maxLength?: number;
    autoFocus?: boolean;
    privacy?: boolean;
}
type InputProps = FullInputProps & Validation;
interface OnSubmitArgs {
    data: Record<string, any> | null;
    edited: Record<string, any> | null;
    resetForm: (key?: string[] | string) => void;
    clearForm: () => void;
    stopPropagation: () => void;
    preventDefault: () => void;
}
type OnSubmit = (args: OnSubmitArgs) => boolean | void | Promise<boolean | void>;
interface Validation {
    required?: boolean;
}
interface InputRefProps {
    focus: () => void;
    blur: () => void;
    reset: () => void;
}
type Year = `${number}${number}${number}${number}`;
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`;
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`;
type DateString = `${Year}-${Month}-${Day}`;

declare const MemoizedStrInput: React$1.NamedExoticComponent<FullInputProps & Validation & React$1.RefAttributes<InputRefProps>>;

interface NumInputProps extends InputProps {
    stringify?: boolean;
}
declare const MemoizedNumInput: React__default.NamedExoticComponent<NumInputProps & React__default.RefAttributes<InputRefProps>>;

interface ArrayHelpers {
    add: (item: any) => void;
    remove: (index: number) => void;
    isLast: (index: number) => boolean;
}
interface ArrayContainerProps {
    name: string;
    items: any[];
    defaultAddItem?: any;
    getKey?: (item: any, index: number) => string;
    children: (args: {
        item: any;
        index: number;
        helpers: ArrayHelpers;
    }) => ReactNode;
}
declare const _default$3: React$1.NamedExoticComponent<ArrayContainerProps>;

interface ObjContainerProps {
    name: string;
    children: ReactNode;
}
declare const MemoizedObjectContainer: React$1.NamedExoticComponent<ObjContainerProps>;

interface SelectProps extends BaseInputProps<TWDropdownStyleProp, DropdownStyleProp> {
    /** NEW — generic dependent dropdown system */
    dependsOn?: string;
    optionsMap?: OptionMap;
    options: SelectOption[] | string[];
    initialLabel?: string;
    searchable?: boolean;
    onToggleDropdown?: (isOpen: boolean) => void;
}
interface OptionMap {
    [key: string]: string[];
}
interface SelectOption {
    label: string;
    value: string;
}

declare const MemoizedSelectInput: React$1.NamedExoticComponent<SelectProps>;

interface FullAutoInputProps {
    initialData?: object;
    exclusionKeys?: string | string[];
    onInputChange?: () => void;
    sharedStyles?: object;
    name?: undefined;
    bgColor?: string;
}
type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">;
declare const MemoizedAutoInput: React__default.NamedExoticComponent<AutoInputProps>;

interface DateProps extends InputProps {
    defaultTodayDate?: boolean;
    defaultDate?: DateString;
}
declare const memoizedDateInput: React__default.NamedExoticComponent<DateProps & React__default.RefAttributes<InputRefProps>>;

interface DisabledInputProps {
    initialValue?: string;
    children?: React.ReactNode;
    placeholder: string;
    style?: Partial<InputStyle>;
    twStyle?: Partial<TWInputStyleProp>;
    privacy?: boolean;
    hideElement?: boolean | string;
    onChange?: OnInputChange;
    name?: string;
}
declare const MemoizedDisabledInput: React$1.NamedExoticComponent<DisabledInputProps>;

interface FormRowProps {
    label: React.ReactNode;
    separator?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    labelWidth?: string | number;
}
declare const _default$2: React$1.NamedExoticComponent<FormRowProps>;

type SearchOnChange<T> = (value: string | number) => T[] | Promise<T[]>;
type SearchInputBaseProps = Omit<InputProps, "onChange" | "style">;
interface SearchInputProps<T> extends SearchInputBaseProps {
    onChange: SearchOnChange<T>;
    twStyle?: Partial<TWDropdownStyleProp & TWInputStyleProp>;
    style?: Partial<InputStyle & DropdownStyleProp>;
    renderItem?: (item: T, index: number, active: boolean) => React.ReactNode;
    onSelect?: (item: T) => void;
}
declare const _default$1: React$1.NamedExoticComponent<SearchInputProps<any> & React$1.RefAttributes<InputRefProps>>;

interface ConfirmationRenderProps {
    success: (data?: any) => void;
    cancel: () => void;
    data: Record<string, any> | null;
    isDisabled?: boolean;
    resetForm: (key?: string[] | string) => void;
    clearForm: () => void;
}
interface SubmitButtonRef {
    submit: (e: MouseEvent<HTMLDivElement>) => void;
}
interface SubmitProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    closeModal?: () => void;
    onClick?: OnSubmit;
    /**
     * Configuration for enabling and customizing a confirmation modal.
     * If provided, the final action (onConfirm) is only executed after the user confirms inside the modal.
     * * @example
     * // Assuming ConfirmComponent is a function that takes ConfirmationRenderProps
     * modal: {
     * modalStyle: { width: '50%' }  // width and height can be in % or px or simple number
     * renderConfirmationModel: (props) => <ConfirmComponent {...props} />,  // prefered to be used as function
     * isDisabled : false    // if you want to disable the cornfirmation modal submit button conditionally
     * onConfirm: handleSubmitFunction,
     * }
     */
    modal?: {
        modalStyle?: {
            height?: string | number;
            width?: string | number;
        };
        renderConfirmationModel?: ((props: ConfirmationRenderProps) => ReactNode) | ReactElement<ConfirmationRenderProps>;
        isDisabled?: boolean;
        onConfirm?: (data: any) => void;
    };
}
declare const MemoizedSubmitButton: React__default.NamedExoticComponent<SubmitProps & React__default.RefAttributes<SubmitButtonRef>>;

declare const FieldVisualState: {
    readonly Edited: "edited";
    readonly Error: "error";
    readonly Warning: "warning";
    readonly Focus: "focus";
    readonly Disabled: "disabled";
};
type FieldVisualState = (typeof FieldVisualState)[keyof typeof FieldVisualState];

interface InputContainerProps {
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    formId?: string;
    mode?: "default" | "edit";
    colorScheme?: FieldVisualState[];
    sharedStyles?: Partial<InputStyle>;
    sharedTwStyles?: Partial<TWInputStyleProp>;
    modalContainerRef?: RefObject<HTMLDivElement>;
}
declare const _default: React$1.NamedExoticComponent<InputContainerProps>;

declare class SharedMemory {
    private storage;
    get(key?: string): any;
    set(key: string, value: any): void;
    addMany(data: Record<string, any>): void;
    remove(key: string): void;
    clear(): void;
}
declare const sharedMemory: SharedMemory;

declare const setEditData: (formId: string, data: Record<string, any>) => void;
declare const setFieldValue: (formId: string, FieldCredentials: FieldProps) => void;
declare const resetForm: (formId: string, key: string[] | string) => void;
declare const clearForm: (formId: string) => void;
declare const formGlobalAction: (formId: string) => {
    setEditData: (data: Record<string, any>) => void;
    setValue: (FieldCredentials: FieldProps) => void;
    resetForm: (key: string[] | string) => void;
    clearForm: () => void;
};

export { _default$3 as ArrayContainer, MemoizedAutoInput as AutoInput, type ConfirmationRenderProps, memoizedDateInput as DateInput, MemoizedDisabledInput as DisabledInput, _default$2 as FormRow, _default as InputContainer, MemoizedNumInput as NumInput, MemoizedObjectContainer as ObjectContainer, type OnBlur, type OnEnterPress, type OnInputChange, type OnSubmit, _default$1 as SearchInput, MemoizedSelectInput as SelectInput, MemoizedStrInput as StrInput, MemoizedSubmitButton as SubmitButton, type SubmitButtonRef, clearForm, formGlobalAction, resetForm, setEditData, setFieldValue, sharedMemory };
