import { Component as ComponentBase, ComponentRenderer } from "icomponent/lib/index";
import { componentFn } from "icomponent/lib/component";
import { bind } from "hyperhtml";
export { ComponentCore } from "icomponent/lib/index";
export { bind, wire } from "hyperhtml";
export const html = (...args) => args;
export function hyperRender() {
    // workaround hyperhtml ts definition bug
    bind(this.getRenderRoot())(...this.view());
}
export class Component extends ComponentBase {
    createRenderer() {
        return new ComponentRenderer(this, hyperRender.bind(this));
    }
}
export function ComponentFn(fn) { return componentFn(fn, Component); }
