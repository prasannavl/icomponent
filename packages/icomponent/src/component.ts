import { makeComponentFn, IComponentFn, IComponentCore, makeComponentCore, Constructor } from "./core";

export interface IComponent extends IComponentCore {
    attr(name: string, defaultValue?: any, transform?: (val: string) => any): any;
}

export function makeComponent<T extends Constructor<HTMLElement>>(Base: T) {
    return class extends makeComponentCore(Base as any) {
        attr(name: string, defaultValue?: any, transform?: (val: string) => any): any {
            let val = this.getAttribute(name);
            if (val == null) return defaultValue;
            return transform != null ? transform(val) : val;
        }
    } as T & Constructor<IComponent>;
}

export class Component extends makeComponent(HTMLElement) {};

// A functional helper that converts plain function into a 
// IComponent. Note that this has one additional behavior, 
// where it passes in the component itself as 
// arguments to the functions.
export function ComponentFn(fn: IComponentFn<Component>) {
    return makeComponentFn(fn, Component);
}