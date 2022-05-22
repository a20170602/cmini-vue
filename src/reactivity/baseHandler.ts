import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { REACITVE_FLAGS, reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get:readonlyGet,
  set:(target:any, key:any, value:any, reactive?:any) => {
    console.warn('readonly is not to be set')
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers , {
  get:shallowReadonlyGet
})

export function createGetter(isReadonly = false , shallow = false) {
  return (target:any, key:any) => {
    if(key === REACITVE_FLAGS.isReactive) {
      return !isReadonly
    } else if (key === REACITVE_FLAGS.isReadonly) {
      return isReadonly
    }

    const result = Reflect.get(target, key);

    if(shallow){
      return result
    }

    if(isObject(result)){
      return !isReadonly ? reactive(result) : readonly(result);
    }
    
    // TODO：收集依赖
    if(!isReadonly){
      track(target, key);
    }

    return result;
  }
}

export function createSetter() {
  return (target:any, key:any, value:any, reactive?:any) => {
    const result = Reflect.set(target, key, value, reactive)
    // TODO: 触发依赖
    trigger(target, key);
    return result
  }
}