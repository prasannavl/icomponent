import { IComponent as IComponentBase, ComponentRenderer  } from "icomponent/lib";
import { componentFn } from "icomponent/lib/component";
import { render, unmountComponentAtNode } from "react-dom";

export { IComponentCore } from "icomponent/lib";
export { createElement } from "react";
export { render } from "react-dom";

export function reactRender() {
    render(this.view(), this.getRenderRoot());
}

export class IComponent extends IComponentBase {
    createRenderer() {
        return new ComponentRenderer(this, reactRender.bind(this));
    }
    disconnected() {
        unmountComponentAtNode(this.getRenderRoot());
        super.disconnected();
    }
}

export function IComponentFn(fn) { return componentFn(fn, IComponent); }
