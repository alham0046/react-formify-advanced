import { isArray, isPlainObject } from "@/functions/dataTypesValidation"

class SharedMemory {
  private storage = new Map<string, any>()

  get(key?: string) {
    return key
      ? this.storage.get(key)
      : Object.fromEntries(this.storage)
  }

  set(key: string, value: any) {
    this.storage.set(key, value)
  }

  setMany(data: Record<string, any>) {
    Object.entries(data).forEach(([k, v]) =>
      this.storage.set(k, v)
    )
  }

  add(key: string, value: Record<string, any>) {
    const prev = this.storage.get(key)

    // 🔹 Fast path: if no previous value → just set
    if (prev === undefined) {
      this.storage.set(key, value)
      return
    }

    // 🔹 Merge only if both are plain objects
    if (isPlainObject(prev) && isPlainObject(value)) {
      // mutate prev (fastest, no extra allocation)
      for (const k in value) {
        prev[k] = value[k]
      }
      return
    }
  }

  push(key: string, value: any[]) {
    const prev = this.storage.get(key)
    if (prev === undefined) {
      this.storage.set(key, [...value])
      return
    }
    if (!isArray(prev)) return
    for (const v of value) prev.push(v)
  }

  update(key: string, updater: (prev: any) => any) {
    let prev = this.storage.get(key)

    // initialize if undefined
    if (prev === undefined) {
      prev = {}
      this.storage.set(key, prev)
    }

    const next = updater(prev)

    if (next !== undefined) {
      this.storage.set(key, next)
    }
  }

  remove(key: string) {
    this.storage.delete(key)
  }

  clear() {
    this.storage.clear()
  }
}

export const sharedMemory = new SharedMemory()