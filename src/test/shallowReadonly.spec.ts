import { isReadonly, shallowReadonly } from "../reactivity";

describe("shallowReadonly", () => {
  test("should not make non-reactive prpperties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1}});
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  })
})