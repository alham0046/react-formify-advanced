import { InputStore } from "./InputStore"

const formRegistry = new Map<string, InputStore>()

export const registerForm = (formId: string, store: InputStore) => {
  formRegistry.set(formId, store)
}

export const unregisterForm = (formId: string) => {
  formRegistry.delete(formId)
}

export const getFormStore = (formId: string) => {
  return formRegistry.get(formId)
}

export const getOrCreateFormStore = (formId: string) => {
  let store = formRegistry.get(formId)

  if (!store) {
    store = new InputStore(formId)
    formRegistry.set(formId, store)
  }

  return store
}