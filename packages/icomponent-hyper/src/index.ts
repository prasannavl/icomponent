import { Component, ComponentRenderer, IComponentFn, IRenderer, makeComponentFn } from "icomponent/lib/index";
import { bind } from "hyperhtml";

export { bind, wire } from "hyperhtml";

export const html = (...args: any[]) => args;

export function hyperRenderer(this: HyperComponent) {
    // workaround hyperhtml ts definition bug
    (bind as any)(this.getRenderRoot() as any)(...this.view());
}

export class HyperComponent extends Component {
    createRenderer(): IRenderer {
        return new ComponentRenderer(this, hyperRenderer.bind(this));
    }
}

export function HyperComponentFn(fn: IComponentFn<HyperComponent>): HyperComponent {
    return makeComponentFn(fn, HyperComponent);
}