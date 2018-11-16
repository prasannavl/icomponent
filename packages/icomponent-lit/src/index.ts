import { Component as ComponentBase, ComponentRenderer, IComponentFn, IRenderer } from "icomponent/lib/index";
import { componentFn } from "icomponent/lib/component";
import { render } from "lit-html";

export { ComponentCore } from "icomponent/lib";
export { html } from "lit-html";

export function litRender(this: Component) {
    render(this.view(), this.getRenderRoot() as any);
}

export class Component extends ComponentBase {
    createRenderer(): IRenderer {
        return new ComponentRenderer(this, litRender.bind(this));
    }
}

export function ComponentFn(fn: IComponentFn<Component>): Component {
    return componentFn(fn, Component);
}