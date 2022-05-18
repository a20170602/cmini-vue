class ReactiveEffect{
  private _fn: any;
  constructor(fn:()=>void){
    this._fn = fn
  }

  run(){
    /** 添加当前活动effect */ 
    activeEffect = this;
    this._fn();
  }
}

export function effect(fn:() => void){
  const reactiveEffect = new ReactiveEffect(fn);
  reactiveEffect.run();
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
