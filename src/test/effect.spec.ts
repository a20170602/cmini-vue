import { reactive } from "../reactivity"
import { effect } from "../reactivity/effect"


describe("effect", ()=> {


  it('happy path', () => {
    const user = reactive({
      age:10
    })
  
    let nextAge:number = 0;

    effect(()=>{
      /** 调用时候使用get 收集依赖 */ 
      nextAge = user.age + 1
    })
  
    expect(nextAge).toBe(11);
  
    /** set 触发依赖 */ 
    user.age++; 
  
    expect(nextAge).toBe(12);

  })

  


})