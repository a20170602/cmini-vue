import { add } from "../reactivity";

 
it('init', () => {
    expect(add(1, 1)).toBe(2);
});