import { ReactiveEffect } from "./effect"

class ComputedImpl {
  private _getter: any
  private _value: any
  private dirty = true
  private _effect:any
  constructor(getter:()=> any){
    this._getter = getter
    this._effect = new ReactiveEffect(getter , ()=> {
      if(!this.dirty){
        this.dirty = true
      }
    });

  }

  get value(){
    if(this.dirty){
      this.dirty = false
      this._value = this._effect.run();   
    }

    return this._value;
  }
}

export function computed(getter:()=> any){
  return new ComputedImpl(getter)
}