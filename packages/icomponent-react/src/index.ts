import { Component, ComponentRenderer, IComponentFn, IRenderer, makeComponentFn } from "icomponent/lib/index";
import { render, unmountComponentAtNode } from "react-dom";

export { createElement } from "react";
export { render } from "react-dom";

export function reactRenderer(this: ReactComponent) {
    render(this.view(), this.getRenderRoot() as any);
}

export class ReactComponent extends Component {
    createRenderer(): IRenderer {
        return new ComponentRenderer(this, reactRenderer.bind(this));
    }
    disconnected() {
        unmountComponentAtNode(this.getRenderRoot() as any);
        super.disconnected();
    }
}

export function ReactComponentFn(fn: IComponentFn<ReactComponent>): ReactComponent {
    return makeComponentFn(fn, ReactComponent);
}