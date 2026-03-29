import type React from "react";
import { isArray } from "../functions/dataTypesValidation";
import { InputStyles } from "./InputStyles";
import { isIndex } from "../Utils/inputStoreUtils";
import { Validator } from "./validatorStore";
import { ComputedStore } from "./computedStore";

type Listener = () => void

const EMPTY_ARRAY: any[] = []

const EMPTY_REF: React.RefObject<HTMLDivElement | null> = { current: null }

export class InputStore {
  private formId: string; // Declare it here
  private styles: InputStyles
  private validator: Validator
  private computedStore: ComputedStore

  constructor(formId: string) {
    this.formId = formId
    this.styles = new InputStyles()
    this.validator = new Validator()
    this.computedStore = new ComputedStore(
      () => this.state.inputData
    )
  }

  private mainContainer: HTMLDivElement | null = null

  setContainerRef(el: HTMLDivElement) {
    this.mainContainer = el
  }

  get stylesStore() {
    return this.styles
  }

  get validatorStore() {
    return this.validator
  }

  getFormId() {
    return this.formId
  }
  // private formId: string

  private rawData = {} as Record<string, any>
  private state = {
    inputData: null as Record<string, any> | null,
    initialData: null as Record<string, any> | null,
    editedKeys: new Set<string>()
  }

  // private computedNodes = new Map<string, ComputedNode>()   ///////// this will be used to store computed nodes. EXPERIMENTAL

  // private dependencyGraph = new Map<string, Set<ComputedNode>>()

  sharedContext = new Map<string, any>()     /////// this will be used to share data between inputs which do not involve in inputData(for side effects)

  dropdownSearch = new Map<string, any[]>()

  dropdownContext = new Map<string, React.RefObject<HTMLDivElement | null>>()

  getDropdownContext(key: string) {
    return this.dropdownContext.get(key) ?? EMPTY_REF
  }

  setDropdownContext(key: string, value: React.RefObject<HTMLDivElement | null>) {
    this.dropdownContext.set(key, value)
    // this.notify(key)
  }

  getDropdownSearch(key: string) {
    // if (!this.dropdownSearch.has('si')) return EMPTY_ARRAY
    return this.dropdownSearch.get(key) || EMPTY_ARRAY
  }

  setDropdownSearch(key: string, value: any[]) {
    this.dropdownSearch.set(key, value)
    this.notify(key)
  }

  private isBatching = false
  private pendingKeys = new Set<string>()


  currentValue = ""

  private _isEditMode = false;

  set isEditMode(value: boolean) {
    if (this._isEditMode !== value) {
      this._isEditMode = value;

      // // RUN YOUR METHOD HERE
      this.state.initialData = {}
    }
  }

  get isEditMode() {
    return this._isEditMode
  }

  backgroundColor = 'white'

  private listeners = new Map<string, Set<Listener>>()     /////// can fix this. can do new Map<string, Listener>() instead.

  subscribe(key: string, listener: Listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }

    this.listeners.get(key)!.add(listener)

    return () => {
      this.listeners.get(key)?.delete(listener)
    }
  }

  private notify(key: string | string[]) {
    if (isArray(key)) {
      key.forEach(k => this.notify(k))
      return
    }

    if (this.isBatching) {
      this.pendingKeys.add(key)
      return
    }

    this.listeners.get(key)?.forEach(l => l())
  }

  private notifyAll() {
    this.listeners.forEach(i => i.forEach(l => l()))
  }

  batch(fn: () => void) {
    this.isBatching = true
    fn()
    this.isBatching = false

    this.pendingKeys.forEach(k => {
      this.listeners.get(k)?.forEach(l => l())
    })
    this.pendingKeys.clear()
  }



  getSnapshot = () => {
    return this.state
  }

  initializeInputStore(mode: "edit" | "default") {
    this.state.inputData = {}
    if (mode === "edit") this.isEditMode = true
  }

  setBackgroundColor(color: string) {
    this.backgroundColor = color
    if (this.mainContainer) {
      this.mainContainer.style.setProperty("--line-bg", color)
    }
  }

  setEditData(data: Record<string, any>) {
    if (!this.isEditMode) return
    this.batch(() => {
      this.state = {
        inputData: structuredClone(data),
        initialData: structuredClone(data),
        editedKeys: new Set()
      }
      this.collectKeys(data)
    })
  }

  private collectKeys(
    obj: Record<string, any>,
    prefix = "",
    paths: string[] = []
  ) {
    for (const key in obj) {
      const value = obj[key]
      const path = prefix ? `${prefix}.${key}` : key

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.collectKeys(value, path, paths)
      } else if (isArray(value)) {
        this.arrayItems.set(path, [...value])
        this.notify(path)
        for (let i = 0; i < value.length; i++) {
          this.collectKeys(value[i], `${path}.${i}`, paths)
        }
      }
      else {
        if (this.listeners.has(path)) {
          this.currentValue = value
          this.notify(path) // queued because batching = true
        }
      }
    }
  }

  setFieldInitialData(key: string, value: any, isDisabledInput?: boolean) {
    this.setNestedValue(this.state.inputData, key, value)
    if (isDisabledInput) {
      this.setNestedValue(this.rawData, key, value)
      return
    } else {
      this.setNestedValue(this.rawData, key, "")
    }
    if (this.isEditMode) {
      this.setNestedValue(this.state.initialData, key, value)
    }
    this.currentValue = value
    this.notify(key)
  }

  /* ---------------- REGISTER COMPUTED ---------------- */

  registerComputed(
    key: string,
    deps: string[],
    evaluate: (data: Record<string, any> | null) => boolean
  ) {
    return this.computedStore.registerComputed(key, deps, evaluate)
  }

  setValue(key: string, value: any) {
    const inputData = this.state.inputData
    if (!inputData) return
    const prev = this.getNestedValue(inputData, key)
    if (prev === value) return
    this.setNestedValue(inputData, key, value)
    this.notify(key)
    // if (!this.isEditMode) return
    if (this.isEditMode) {
      const initial = this.getNestedValue(this.state.initialData, key)
      if (initial === undefined) this.setNestedValue(this.state.initialData, key, value)
      const wasEdited = this.state.editedKeys.has(key)
      const isEdited = value !== initial
      if (isEdited) {
        this.state.editedKeys.add(key)
      }
      else this.state.editedKeys.delete(key)
      if (wasEdited !== isEdited) {
        if (isEdited) {
          this.styles.enable(key, 'edited')
        } else {
          this.styles.disable(key, 'edited')
        }
      }
    }

    const error = this.validator.validateField(
      key,
      value,
      inputData
    )

    this.computedStore.trigger(key)
  }


  getValue(key: string) {
    return this.getNestedValue(this.state.inputData, key)
  }

  reset(key?: string | string[]) {
    if (key) {
      if (typeof key === "string") {
        this.setValue(key, "")
        return
      }
      if (isArray(key)) {
        key.forEach(k => this.setValue(k, ""))
        return
      }
    }
    const data = structuredClone(this.rawData ?? {})
    this.state = {
      inputData: data,
      initialData: this.isEditMode ? structuredClone(data) : null,
      editedKeys: new Set()
    }
    this.currentValue = ""
    this.arrayItems.clear()
    this.sharedContext.clear()
    this.notifyAll()
  }

  clear() {
    this.state = {
      inputData: null,
      initialData: null,
      editedKeys: new Set()
    }
    this.currentValue = ""
    this.sharedContext.clear()
    this.arrayItems.clear()
  }

  private setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.')
    let curr = obj

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const nextKey = keys[i + 1]

      // Decide container type for current key
      if (isIndex(key)) {
        const index = Number(key)
        if (!Array.isArray(curr)) {
          throw new Error(`Expected array at ${keys.slice(0, i).join('.')}`)
        }
        curr[index] ??= isIndex(nextKey) ? [] : {}
        curr = curr[index]
      } else {
        curr[key] ??= isIndex(nextKey) ? [] : {}
        curr = curr[key]
      }
    }

    const lastKey = keys.at(-1)!

    if (isIndex(lastKey)) {
      if (!Array.isArray(curr)) {
        throw new Error(`Expected array at ${keys.slice(0, -1).join('.')}`)
      }
      curr[Number(lastKey)] = value
    } else {
      curr[lastKey] = value
    }
  }

  private getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((curr, key) => {
      if (curr == null) return undefined
      return isIndex(key) ? curr[Number(key)] : curr[key]
    }, obj)
  }

  private arrayItems = new Map<string, any[]>()   ////// path -> array items

  getArrayItems(path: string) {
    const arr = this.arrayItems.get(path)
    return arr
  }

  addArrayItem(path: string, value: any) {
    const prev = this.arrayItems.get(path) ?? []


    const next = Array.isArray(value)
      ? [...prev, ...value]
      : [...prev, value]

    this.arrayItems.set(path, next)
    this.notify(path)
  }

  removeArrayItem(path: string, index: number) {
    const prev = this.arrayItems.get(path)
    if (!Array.isArray(prev)) return

    const next = prev.filter((_, i) => i !== index)
    this.arrayItems.set(path, next)

    this.notify(path)
  }
}


// registerComputed(
//   key: string,
//   deps: string[],
//   // evaluate: (data: Record<string, any> | null) => boolean
//   evaluate: (data: Record<string, any> | null) => boolean
// ) {

//   if (this.computedNodes.has(key)) {
//     return this.computedNodes.get(key)!
//   }

//   const node: ComputedNode = {
//     deps,
//     evaluate,
//     listeners: new Set(),
//     value: false
//   }

//   node.value = evaluate(this.state.inputData)

//   this.computedNodes.set(key, node)

//   /* build dependency graph */

//   deps.forEach(dep => {

//     if (!this.dependencyGraph.has(dep)) {
//       this.dependencyGraph.set(dep, new Set())
//     }

//     this.dependencyGraph.get(dep)!.add(node)

//   })

//   return node
// }



// private recompute(node: ComputedNode) {

//   const next = node.evaluate(this.state.inputData)

//   if (next === node.value) return

//   node.value = next

//   node.listeners.forEach(cb => cb())
// }


// setValue(key: string, value: any) {
// const inputData = this.state.inputData
// if (!inputData) return
// const prev = this.getNestedValue(inputData, key)
// if (prev === value) return
// this.setNestedValue(inputData, key, value)
// this.notify(key)
// // if (!this.isEditMode) return
// if (this.isEditMode) {
//   const initial = this.getNestedValue(this.state.initialData, key)
//   if (initial === undefined) this.setNestedValue(this.state.initialData, key, value)
//   const wasEdited = this.state.editedKeys.has(key)
//   const isEdited = value !== initial
//   if (isEdited) {
//     this.state.editedKeys.add(key)
//   }
//   else this.state.editedKeys.delete(key)
//   if (wasEdited !== isEdited) {
//     if (isEdited) {
//       this.styles.enable(key, 'edited')
//     } else {
//       this.styles.disable(key, 'edited')
//     }
//   }
// }

// this.computedStore.trigger(key)
/* recompute dependent expressions */

// const computed = this.dependencyGraph.get(key)

// if (!computed) return


// computed.forEach(node => this.recompute(node))
// }