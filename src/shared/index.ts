export const extend = Object.assign
export function isObject(target:any) {
  return target !== null && typeof target ==='object'
}
export function hasChanged(newVal:any , oldVal:any) {
  return !Object.is(newVal, oldVal)
}