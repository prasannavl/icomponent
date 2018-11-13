import { IComponent as IComponentBase, Renderer  } from "icomponent/lib";
import { componentFn } from "icomponent/lib/component";
import { render } from "lit-html";

export { IComponentCore } from "icomponent/lib";
export { html } from "lit-html";

export function litRender() {
    render(this.view(), this.getRenderRoot());
}

export class IComponent extends IComponentBase {
    createRenderer() {
        return new Renderer(this, litRender.bind(this));
    }
}

export function IComponentFn(fn) { return componentFn(fn, IComponent); }
