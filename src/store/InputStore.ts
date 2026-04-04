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
        const arrayItor = []
        // this.arrayItems.set(path, [...value])
        // this.notify(path)
        for (let i = 0; i < value.length; i++) {
          arrayItor.push(i)
          this.collectKeys(value[i], `${path}.${i}`, paths)
        }
        this.arrayIterator.set(path, arrayItor)
        this.notify(path)
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

  setSilentValue(key: string, value: any) {                  ////// SILENT. NO NOTIFICATION
    this.setNestedValue(this.state.inputData, key, value)
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
    this.arrayIterator.clear()
    this.arrayObject.clear()
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
    this.arrayIterator.clear()
    this.arrayObject.clear()
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

  private arrayObject = new Map<string, Set<any>>()
  private arrayIterator = new Map<string, number[]>()

  setArrayObject(path: string, value: string) {
    if (!this.arrayObject.has(path)) {
      this.arrayObject.set(path, new Set())
    }
    this.arrayObject.get(path)?.add(value)
  }

  getArrayItems(path: string) {
    return this.arrayIterator.get(path)
  }

  getArrayLength(path: string) {
    return this.arrayIterator.get(path)?.length ?? 0
  }

  addItorator(path: string, index: number) {
    const prev = this.arrayIterator.get(path)
    if (!isArray(prev)) return
    if (index <= prev.length - 1) return
    const next = [...prev, index]
    this.arrayIterator.set(path, next)
    // this.notify(path)
  }

  initArray(path: string, iterator: number[]) {
    this.arrayIterator.set(path, iterator)
  }


  replaceArray(path: string, items: Record<string, any>[]) {
    const currentItor = this.arrayIterator.get(path)
    if (!currentItor) return
    const iterator: number[] = []
    const prevItorSize = currentItor.length
    const prevArrKeys = this.arrayObject.get(path)
    this.batch(() => {
      items!.forEach((value, index) => {
        if (index < prevItorSize) {
          prevArrKeys?.forEach((val) => {
            this.setValue(`${path}.${index}.${val}`, value[val])
          })
        } else {
          prevArrKeys?.forEach((val) => {
            this.setSilentValue(`${path}.${index}.${val}`, value[val])
          })
        }
        // this.addItorator(path, index)
        iterator.push(index)
      })
      this.arrayIterator.set(path, iterator)
      this.notify(path)
    })
  }

  addArrayItem(path: string, initialValue?: Record<string, any>[], repeat: number = 1) {
    const currentItor = this.arrayIterator.get(path)
    if (!currentItor) return
    const prevItorSize = currentItor.length
    const newItorArr: number[] = [...currentItor]

    const prevArrKeys = this.arrayObject.get(path)
    this.batch(() => {
      for (let i = 0; i < repeat; i++) {
        const newIndex = prevItorSize + i
        newItorArr.push(newIndex)
        prevArrKeys?.forEach((key) => {
          this.setSilentValue(`${path}.${newIndex}.${key}`, initialValue?.[i]?.[key] ?? "")
        })
      }
      this.arrayIterator.set(path, newItorArr)
      this.notify(path)
    })
  }

  addArrayItems(
    path: string,
    items: Record<string, any> | Record<string, any>[],
    type: 'append' | 'replace' = 'append'
  ) {
    const data = this.state.inputData
    if (!data) return

    const prev = this.getValue(path) ?? []

    const itemsArray = isArray(items) ? items : [items]

    this.batch(() => {
      let next: Record<string, any>[]

      // 🔥 REPLACE
      if (type === 'replace') {
        next = itemsArray
      }
      // 🔥 APPEND
      else {
        next = [...prev, ...itemsArray]
      }

      // ✅ set full array
      this.setSilentValue(path, next)

      // ✅ update iterator (derived)
      const nextIterator = Array.from({ length: next.length }, (_, i) => i)
      this.arrayIterator.set(path, nextIterator)

      // 🔥 notify only NEW items (important optimization)
      if (type === 'append') {
        const startIndex = prev.length

        for (let i = startIndex; i < next.length; i++) {
          const item = next[i]

          for (const key in item) {
            this.notify(`${path}.${i}.${key}`)
          }
        }
      }

      // 🔥 for replace → notify everything
      else {
        for (let i = 0; i < next.length; i++) {
          const item = next[i]

          for (const key in item) {
            this.notify(`${path}.${i}.${key}`)
          }
        }
      }

      // 🔥 structure update
      this.notify(path)
    })
  }

  getArrayKeys(path: string) {
    return this.arrayObject.get(path) ?? []
  }

  getArrayKeySize(path: string) {
    return this.arrayObject.get(path)?.size ?? 0
  }

  removeArrayItem(path: string, index: number) {
    const arrData = this.getValue(path)
    if (!isArray(arrData)) return

    const prev = this.arrayIterator.get(path)
    if (!prev) return

    const next = prev.slice(0, -1)
    // this.arrayIterator.set(path, next)

    const length = prev.length

    this.batch(() => {
      // 🔥 if last index → simple pop
      if (index === length - 1) {
        if (index === 0) {
          for (const key in arrData[0]) {
            this.setValue(`${path}.0.${key}`, "")
          }
          return
        }
        arrData.pop()
        this.setSilentValue(path, arrData)

        // this.arrayIterator.set(path, arrData.map((_, i) => i))
        this.arrayIterator.set(path, next)

        this.notify(path)
        return
      }

      // 🔥 remove + shift
      const newData = arrData.filter((_, i) => i !== index)

      this.setSilentValue(path, newData)

      // 🔥 notify shifted fields only
      for (let i = index; i < newData.length; i++) {
        for (const key in newData[i]) {
          this.notify(`${path}.${i}.${key}`)
        }
      }

      // 🔥 update iterator
      // this.arrayIterator.set(path, newData.map((_, i) => i))
      this.arrayIterator.set(path, next)

      this.notify(path)
    })
  }

  popArrayItem(path: string, iterator?: number[]) {
    const prev = iterator ?? this.arrayIterator.get(path)
    // console.log('going to pop item')
    if (!isArray(prev)) return
    const next = prev.slice(0, -1)
    this.arrayIterator.set(path, next)
    this.notify(path)
    const arrData = this.getValue(path)
    if (!isArray(arrData)) return
    arrData.pop()
  }
}


// private arrayItems = new Map<string, any[]>()   ////// path -> array items

//   getArrayItems(path: string) {
//     const arr = this.arrayItems.get(path)
//     return arr
//   }

//   addArrayItem(path: string, value: any) {
//     const prev = this.arrayItems.get(path) ?? []


//     const next = Array.isArray(value)
//       ? [...prev, ...value]
//       : [...prev, value]

//     this.arrayItems.set(path, next)
//     this.notify(path)
//   }

//   removeArrayItem(path: string, index: number) {
//     const prev = this.arrayItems.get(path)
//     if (!Array.isArray(prev)) return

//     const next = prev.filter((_, i) => i !== index)
//     this.arrayItems.set(path, next)

//     this.notify(path)
//   }