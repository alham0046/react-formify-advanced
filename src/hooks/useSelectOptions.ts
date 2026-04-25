import type { InputStore } from "../store/InputStore";
import { useMemo, useSyncExternalStore } from "react";
// import type { InputStore } from "../InputStore";

export interface SelectOption {
  label: string;
  value: string;
}

export interface OptionMap {
  [key: string]: string[];
}

export const useSelectOptions = ({
  //   name,
  options,
  dependsOn,
  optionsMap,
  initialLabel,
  initialValue,
  inputStore
}: {
  options?: SelectOption[] | string[]
  dependsOn?: string
  optionsMap?: OptionMap
  initialLabel?: string
  initialValue?: string
  inputStore: InputStore
}) => {
  const depValue = dependsOn
    ? useSyncExternalStore(
      cb => inputStore.subscribe(dependsOn, cb),
      () => inputStore.getValue(dependsOn)
    )
    : null;

  // return useMemo(() => {
  //   const base =
  //     dependsOn && optionsMap
  //       ? optionsMap[depValue ?? ""] ?? []
  //       : options ?? [];

  //   const normalized =
  //     typeof base[0] === "string"
  //       ? (base as string[]).map(v => ({ label: v, value: v }))
  //       : base as SelectOption[];

  //   return initialLabel
  //     ? [{ label: initialLabel, value: initialValue! }, ...normalized]
  //     : normalized;
  // }, [depValue, options, optionsMap, initialLabel, initialValue]);

  return useMemo(() => {
    const base =
      dependsOn && optionsMap
        ? optionsMap[depValue ?? ""] ?? []
        : options ?? []

    const normalized =
      typeof base[0] === "string"
        ? (base as string[]).map(v => ({ label: v, value: v }))
        : base as SelectOption[]

    const finalOptions = initialLabel
      ? [{ label: initialLabel, value: initialValue! }, ...normalized]
      : normalized

    const map = new Map<string, string>()
    finalOptions.forEach(opt => {
      map.set(opt.value, opt.label)
    })

    return {
      optionsList: finalOptions,
      valueToLabel: map
    }
  }, [depValue, options, optionsMap, initialLabel, initialValue])
};
