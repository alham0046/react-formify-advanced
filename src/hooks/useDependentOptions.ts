import { useMemo, useSyncExternalStore } from "react";
import { inputStore } from "../store/InputStore";

export interface SelectOption {
    label: string;
    value: string;
}

export interface OptionMap {
    [key: string]: string[];
}

export const useDependentOptions = (
    name: string,
    dependsOn?: string,
    optionsMap?: OptionMap,
    initialLabel?: string,
    initialValue?: string,
) : SelectOption[] | null => {
    // Case 1: Not a dependent select
    // console.log('the depedns on value outside is')
    if (!dependsOn || !optionsMap) {
        return null;
    }

    // Subscribe only to the dependency field
    const depValue = useSyncExternalStore(
        (cb) => inputStore.subscribe(dependsOn, cb),
        () => inputStore.getInputNestedValue(dependsOn)
    );

    return useMemo(() => {
        const parent = depValue || "";
        const rawOptions = optionsMap[parent] || [];

        const initialItem = initialLabel
            ? [{ label: initialLabel, value: initialValue! }]
            : [];

        return [
            ...initialItem,
            ...rawOptions.map(item => ({ label: item, value: item }))
        ];
    }, [depValue, optionsMap, initialLabel, initialValue]);
};
