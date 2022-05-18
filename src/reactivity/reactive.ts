import { track, trigger } from "./effect";

export function reactive(raw:Record<string,any>){
  return new Proxy(raw , {
    get(target, key){
      const result = Reflect.get(target, key);
      // TODO：收集依赖
      track(target, key);
      return result;
    },

    set(target, key, value, reactive?:any){
      const result = Reflect.set(target, key, value, reactive)
      // TODO: 触发依赖
      trigger(target, key);
      return result
    }

  });
}