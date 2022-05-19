class ReactiveEffect{
  private _fn: any;
  deps = [];
  public scheduler?: undefined | Function
  public onStop?: undefined | Function
  private active = true
  constructor(fn:()=>any){
    this._fn = fn
  }

  run() {
    /** 添加当前活动effect */ 
    activeEffect = this;
    return this._fn();
  }

  stop() {
    /** stop 限制只触发一次 */ 
    if(this.active){
      /** 将对应的依赖卸载 */ 
      cleanupEffect(this);

      this.onStop && this.onStop();

      this.active = false
    }

  }
}

function cleanupEffect(effect:ReactiveEffect){
  effect.deps.forEach((dep:Set<ReactiveEffect>)=> {
    dep.delete(effect);
  })
}

export function effect(fn:() => any , options:any = {}){
  const _effect = new ReactiveEffect(fn);
  Object.assign(_effect, options);
  _effect.run();
  /** 要让this指向当前实例 */
  const runner:any = _effect.run.bind(_effect);
  runner.effect =_effect
  return runner;
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
  if(!activeEffect) return;
  // 添加依赖
  dep.add(activeEffect);
  // 反向添加依赖
  activeEffect.deps.push(dep);

}

export function trigger(target:any, key:string | symbol) {
  const depMaps = targetMaps.get(target);
  const dep = depMaps.get(key);
  for (const effect of dep) {
    if(effect.scheduler){
      effect.scheduler()
    }else{
      effect.run();
    }
  }
}

export function stop(runner:any){
  runner.effect.stop();
}
