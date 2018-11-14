import { IComponent as IComponentBase, ComponentRenderer  } from "icomponent/lib";
import { componentFn } from "icomponent/lib/component";
import { render } from "lit-html";

export { IComponentCore } from "icomponent/lib";
export { html } from "lit-html";

export function litRender() {
    render(this.view(), this.getRenderRoot());
}

export class IComponent extends IComponentBase {
    createRenderer() {
        return new ComponentRenderer(this, litRender.bind(this));
    }
}

export function IComponentFn(fn) { return componentFn(fn, IComponent); }
