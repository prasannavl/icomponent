import { Component as ComponentBase, ComponentRenderer, IComponentFn, IRenderer } from "icomponent/lib/index";
import { componentFn } from "icomponent/lib/component";
import { render, unmountComponentAtNode } from "react-dom";

export { ComponentCore } from "icomponent/lib";
export { createElement } from "react";
export { render } from "react-dom";

export function reactRender(this: Component) {
    render(this.view(), this.getRenderRoot() as any);
}

export class Component extends ComponentBase {
    createRenderer(): IRenderer {
        return new ComponentRenderer(this, reactRender.bind(this));
    }
    disconnected() {
        unmountComponentAtNode(this.getRenderRoot() as any);
        super.disconnected();
    }
}

export function ComponentFn(fn: IComponentFn<Component>): Component {
    return componentFn(fn, Component);
}