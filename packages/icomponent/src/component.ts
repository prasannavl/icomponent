import { ComponentCore, makeComponentFn, IComponentFn, Constructor } from "./core";

class ComponentImpl extends HTMLElement {
    static observedAttributes: Array<string> = [];

    constructor() {
        super();
        ComponentCore.init(this);
    }

    attr(name: string, defaultValue?: any, transform?: (val: string) => any) {
        let val = this.getAttribute(name);
        if (val == null) return defaultValue;
        return transform != null ? transform(val) : val;
    }
}

interface ComponentStatics {
    observedAttributes: Array<string>;
}

ComponentCore.extend(ComponentImpl);
export interface IComponent extends ComponentImpl, ComponentStatics, ComponentCore, Constructor<IComponent> { }
export const Component: IComponent = ComponentImpl as any;

// A functional helper that converts plain function into a 
// IComponent. Note that this has one additional behavior, 
// where it passes in the component itself as 
// arguments to the functions.
export function ComponentFn(fn: IComponentFn<IComponent>): IComponent {
    return makeComponentFn(fn, Component);
}