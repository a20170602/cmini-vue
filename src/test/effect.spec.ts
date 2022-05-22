import { reactive } from "../reactivity"
import { effect,stop } from "../reactivity/effect"


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

  it("scheduler", () => {
    /***
     * 1、通过 effect 的第二个参数给定的 一个 scheduler 的 fn
     * 2、effect 第一次执行的时候 还会执行 fn
     * 3、当 响应式对象 set update 不会执行 fn 而是执行 scheduler
     * 4、如果说当执行 runner 的时候， 会再次执行fn
     */
    let dummy;
    let run: any;

    const scheduler = jest.fn(() => {
      run = runner;
    })

    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);


  })

  it("stop", () => {
    /**
     * 需求
     * 1.调用了stop runner后 set将不在触发这个dep
     * 2.调用runner 还是会调用函数
     * */ 
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });

    obj.prop = 2;

    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);
    obj.prop++
    expect(dummy).toBe(2);
    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(4);

  })

  it("onStop", () => {
    const obj = reactive({
      foo: 1
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);

  })

})