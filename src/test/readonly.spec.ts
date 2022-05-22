import { isProxy, isReadonly, readonly } from "../reactivity";

describe('readonly', ()=> {
  it('happy path', ()=> {
    const original = { foo: 1 , bar: { baz: 2 }};
    const wrapped = readonly(original);
    /** observed 和 original 的指向不一样 */
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isProxy(wrapped.bar)).toBe(true);
  })

  it("warn then call set", () => {
    console.warn = jest.fn();

    const user = readonly({
      age: 10
    });

    user.age = 11;

    expect(console.warn).toBeCalled();

  })
})