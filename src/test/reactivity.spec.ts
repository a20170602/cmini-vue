import { reactive } from "../reactivity";

describe('reactive', ()=> {
  it('happy path', ()=> {
    const original = { foo: 1};
    const observed = reactive(original);
    /** observed 和 original 的指向不一样 */
    expect(original).not.toBe(observed);

    /** observed.foo ==> 1 */
    expect(observed.foo).toBe(1);

  })

})