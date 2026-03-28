// export function getNestedValue(obj: any, path: any): any {
//     if (!path || typeof path !== "string") return undefined; // <-- prevent crash
//     if (!path.includes(".")) return obj[path]
//     return path.split('.').reduce((acc, key) => acc?.[key], obj);
// }

export function getNestedValue(obj: any, path: string) {
    // console.log('getting nested value', obj, path)
  return path.split('.').reduce((curr, key) => {
    if (curr == null) return undefined
    return isIndex(key) ? curr[Number(key)] : curr[key]
  }, obj)
}


export const isIndex = (key: string) => {
  return key !== "" && !isNaN(Number(key))
}