import type { DropdownOption } from "../components/BaseDropdown"
import type { InputStore } from "./InputStore"

type OptionNode = {
  baseOptions: DropdownOption[]
  derivedOptions: DropdownOption[]
  valueToLabel: Map<string, string>
  dependsOn?: string
  mapFn?: (depValue: any, options: DropdownOption[]) => DropdownOption[]
  search: string
}

export class OptionGraph {
  private nodes = new Map<string, OptionNode>()
  private listeners = new Map<string, Set<() => void>>()

  constructor(private inputStore: InputStore) {

  }

  // ----------------------------
  // Subscribe
  // ----------------------------
  subscribe(path: string, cb: () => void) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set())
    }
    this.listeners.get(path)!.add(cb)

    return () => {
      this.listeners.get(path)?.delete(cb)
    }
  }

  private notify(path: string) {
    this.listeners.get(path)?.forEach(l => l())
  }

  // ----------------------------
  // Register dropdown
  // ----------------------------
  register(path: string, config: {
    options?: DropdownOption[] | string[]
    dependsOn?: string
    mapFn?: (depValue: any, options: DropdownOption[]) => DropdownOption[]
    initialSelected?: string
  }) {
    const normalized = this.normalize(config.options || [])

    const valueSet = new Set<string>(normalized.map(opt => opt.value))

    const node: OptionNode = {
      baseOptions: normalized,
      derivedOptions: normalized,
      valueToLabel: normalized ? this.createLabelMap(normalized) : new Map<string, string>(),
      dependsOn: config.dependsOn,
      mapFn: config.mapFn,
      search: ""
    }

    this.nodes.set(path, node)

    const initialSelected = config.initialSelected

    let initialValue = ""

    if (initialSelected && valueSet.has(initialSelected)) {
      initialValue = initialSelected
    }

    this.inputStore.setFieldInitialData(path, initialValue)
    // 🔥 subscribe to dependency
    if (config.dependsOn) {
      this.inputStore.subscribe(config.dependsOn, () => {
        this.recompute(path)
      })
    }
  }

  // ----------------------------
  // Set options dynamically
  // ----------------------------
  set(path: string, options: DropdownOption[] | string[], initialSelected: string = "") {
    const node = this.nodes.get(path)
    if (!node) return

    const normalized = this.normalize(options)

    node.baseOptions = normalized
    node.valueToLabel = this.createLabelMap(normalized)

    this.inputStore.setValue(path, initialSelected)


    this.recompute(path)
  }

  // ----------------------------
  // Search (per dropdown)
  // ----------------------------
  setSearch(path: string, value: string) {
    const node = this.nodes.get(path)
    if (!node) return

    const m_value = value.toLowerCase()

    if (node.search === m_value) return

    node.search = m_value
    this.recompute(path)
  }

  // ----------------------------
  // Compute options
  // ----------------------------
  private recompute(path: string) {
    const node = this.nodes.get(path)
    if (!node) return

    let options = node.baseOptions

    // 🔥 apply dependency
    if (node.dependsOn && node.mapFn) {
      const depValue = this.inputStore.getValue(node.dependsOn)
      options = node.mapFn(depValue, options)
    }

    // 🔥 apply search
    if (node.search) {
      options = options.filter(opt =>
        opt.label.toLowerCase().includes(node.search)
      )
    }

    node.valueToLabel = this.createLabelMap(options)

    node.derivedOptions = options

    this.notify(path)
  }

  // ----------------------------
  // Getters
  // ----------------------------
  getOptions(path: string) {
    return this.nodes.get(path)?.derivedOptions ?? []
  }

  getLabel(path: string) {
    const value = this.inputStore.getValue(path)
    const node = this.nodes.get(path)
    if (!node) return ""

    return node.valueToLabel.get(value) ?? ""
    // return this.nodes.get(path)?.valueToLabel.get(value)
  }

  getNode(key: string) {
    return this.nodes.get(key)
  }

  hasPath(path: string) {
    return this.nodes.has(path)
  }

  doOptionExist(path: string, value: string) {
    const node = this.nodes.get(path)
    if (!node) return 1
    return node.valueToLabel.has(value)
  }

  // ----------------------------
  // Utils
  // ----------------------------
  private normalize(options: DropdownOption[] | string[]): DropdownOption[] {
    return options.map(opt =>
      typeof opt === "string"
        ? { label: opt, value: opt }
        : opt
    )
  }

  private createLabelMap(options: DropdownOption[]) {
    const map = new Map<string, string>()
    options.forEach(opt => map.set(opt.value, opt.label))
    return map
  }
}