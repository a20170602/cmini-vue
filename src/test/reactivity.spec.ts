import { isProxy, isReactive, isReadonly, reactive , readonly} from "../reactivity";

describe('reactive', ()=> {
  it('happy path', ()=> {
    const original = { foo: 1};
    const observed = reactive(original);
    /** observed 和 original 的指向不一样 */
    expect(original).not.toBe(observed);

    /** observed.foo ==> 1 */
    expect(observed.foo).toBe(1);

  })

  it("isReactive", ()=> {
    const original = { foo: 1};
    const observed = reactive(original);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  })

  it("isReadonly", ()=> {
    const original = { foo: 1};
    const observed = readonly(original);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  })


  // 嵌套的reactive ｜ readonly
  it("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2}],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  })

})