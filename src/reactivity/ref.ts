import { hasChanged, isObject } from "../shared";
import { isTracking, ReactiveEffect, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";


class RefImpl {
  private _value: any;
  private _rawVal:any
  public dep: Set<ReactiveEffect>;
  public flag = '__v_isRef'

  constructor(value:any){
    this._value = conver(value);
    this._rawVal = value;
    this.dep = new Set();
  }

  get value() {
    // 添加依赖
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    if(hasChanged(newVal, this._rawVal)){
      this._rawVal = newVal;
      this._value = conver(newVal);
      triggerEffect(this.dep)
    }
  }
}

function trackRefValue(ref:RefImpl){
  if(isTracking()) {
    trackEffect(ref.dep);
  }
}

function conver(value:any){
  return isObject(value) ? reactive(value) : value;
}


export function ref(value:any) {
  return new RefImpl(value);
}

export function isRef(ref:any){
  return ref.flag === '__v_isRef'
}

export function unRef(ref:any) {
  if(isRef(ref)) {
    return ref.value
  }
  return ref;
}

export function proxyRefs(objectWithRef:any) {
  return new Proxy(objectWithRef, {
    get(target, key){
      /**
       * 是ref返回 ref.value
       * 不是ref返回当前值
      */
     return unRef(Reflect.get(target, key)) 
    },
    set(target, key, value, receiver?:any){
      /**
       * 当 target[key] 原本是 ref ， 而需要设置的元素不是ref时
      */
     if(isRef(target[key]) && !isRef(value)){
       return (target[key].value = value)
     }

      return Reflect.set(target, key, value, receiver);
    }
  })
}