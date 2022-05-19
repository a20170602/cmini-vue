class ReactiveEffect{
  private _fn: any;
  constructor(fn:()=>void){
    this._fn = fn
  }

  run(){
    /** 添加当前活动effect */ 
    activeEffect = this;
    return this._fn();
  }
}

export function effect(fn:() => void){
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  /** 要让this指向当前实例 */
  return _effect.run.bind(_effect);
}

/** 收集依赖 */ 
const targetMaps = new Map();
let activeEffect:any = null;
export function track(target:any, key:string | symbol) {
  // 映射 target ==> key ==> dep
  let depMaps = targetMaps.get(target);
  if(!depMaps){
    depMaps = new Map();
    targetMaps.set(target, depMaps);
  }

  let dep = depMaps.get(key);
  if(!dep){
    dep = new Set();
    depMaps.set(key, dep);
  }
  // 添加依赖
  dep.add(activeEffect);

}

export function trigger(target:any, key:string | symbol) {
  const depMaps = targetMaps.get(target);
  const dep = depMaps.get(key);
  for (const effect of dep) {
    effect.run();
  }
}
