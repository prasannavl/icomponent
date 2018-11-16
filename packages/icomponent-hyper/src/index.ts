import { Component as ComponentBase, ComponentRenderer, IComponentFn } from "icomponent/lib/index";
import { componentFn } from "icomponent/lib/component";
import { bind } from "hyperhtml";

export { ComponentCore } from "icomponent/lib/index";
export { bind, wire } from "hyperhtml";

export const html = (...args: any[]) => args;

export function hyperRender(this: Component) {
    // workaround hyperhtml ts definition bug
    (bind as any)(this.getRenderRoot() as any)(...this.view());
}

export class Component extends ComponentBase {
    createRenderer() {
        return new ComponentRenderer(this, hyperRender.bind(this));
    }
}

export function ComponentFn(fn: IComponentFn) { return componentFn(fn, Component); }
