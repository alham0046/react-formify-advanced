import type { BaseInputProps } from "./baseProps";
import type { DropdownStyleProp, TWDropdownStyleProp } from "./stylesProps";

export interface SelectProps extends BaseInputProps<TWDropdownStyleProp, DropdownStyleProp> {
    /** NEW — generic dependent dropdown system */
    dependsOn?: string;
    optionsMap?: OptionMap;
    options: SelectOption[] | string[]
    initialLabel?: string
    searchable?: boolean
    onToggleDropdown?: (isOpen: boolean) => void
}

// type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

export interface OptionMap {
    [key: string]: string[];
}

interface SelectOption {
    label: string;
    value: string;
}