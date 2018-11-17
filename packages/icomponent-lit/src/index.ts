import { Component, ComponentRenderer, IComponentFn, IRenderer, makeComponentFn } from "icomponent/lib/index";
import { render } from "lit-html";

export { html, render } from "lit-html";

export function litRenderer(this: LitComponent) {
    render(this.view(), this.getRenderRoot() as any);
}

export class LitComponent extends Component {
    createRenderer(): IRenderer {
        return new ComponentRenderer(this, litRenderer.bind(this));
    }
}

export function LitComponentFn(fn: IComponentFn<LitComponent>): LitComponent {
    return makeComponentFn(fn, LitComponent);
}