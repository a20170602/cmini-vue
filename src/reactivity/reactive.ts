import { readonlyHandlers, createGetter, mutableHandlers, shallowReadonlyHandlers } from "./baseHandler";

export enum REACITVE_FLAGS {
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly'
}



export function reactive(raw:Record<string,any>){
  return createActiveObject(raw, mutableHandlers);
}

export function shallowReadonly(raw:Record<string,any>) {
  return createActiveObject(raw , shallowReadonlyHandlers);
}

export function readonly(raw:Record<string,any>) {
  return createActiveObject(raw , readonlyHandlers);
}

function createActiveObject(raw:any , handlers:any){
  return new Proxy(raw , handlers);
}

export function isReactive(value:any) {
  return !!value[REACITVE_FLAGS.isReactive]
}

export function isReadonly(value:any) {
  return !!value[REACITVE_FLAGS.isReadonly]
}
export function isProxy(value:any){
  return isReactive(value) || isReadonly(value);
}

