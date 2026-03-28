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

  addMany(data: Record<string, any>) {
    Object.entries(data).forEach(([k, v]) =>
      this.storage.set(k, v)
    )
  }

  remove(key: string) {
    this.storage.delete(key)
  }

  clear() {
    this.storage.clear()
  }
}

export const sharedMemory = new SharedMemory()