import { ComponentCore as ComponentCoreBase, ComponentRenderer } from "icomponent/lib/index";
import { componentFn } from "icomponent/lib/component";
import { render } from "lit-html";
export { ComponentCore } from "icomponent/lib";
export { html } from "lit-html";
export function litRender() {
    render(this.view(), this.getRenderRoot());
}
export class Component extends ComponentCoreBase {
    createRenderer() {
        return new ComponentRenderer(this, litRender.bind(this));
    }
}
export function ComponentFn(fn) { return componentFn(fn, Component); }
