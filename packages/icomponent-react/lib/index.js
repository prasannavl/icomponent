import { ComponentCore as ComponentCoreBase, ComponentRenderer } from "icomponent/lib/index";
import { componentFn } from "icomponent/lib/component";
import { render, unmountComponentAtNode } from "react-dom";
export { ComponentCore } from "icomponent/lib";
export { createElement } from "react";
export { render } from "react-dom";
export function reactRender() {
    render(this.view(), this.getRenderRoot());
}
export class Component extends ComponentCoreBase {
    createRenderer() {
        return new ComponentRenderer(this, reactRender.bind(this));
    }
    disconnected() {
        unmountComponentAtNode(this.getRenderRoot());
        super.disconnected();
    }
}
export function ComponentFn(fn) { return componentFn(fn, Component); }
