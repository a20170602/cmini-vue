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


  it('runner should be return when call effect', () => {
    let foo = 10;

    const runner = effect(() => {
      foo++;
      return "foo";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");

  })

})