import { render } from "lit-html";
import { IElement as CoreIElement, IComponent as CoreIComponent, iFnComponentCore } from "icomponent/lib/base";

export * from "./utils";
export { html } from "lit-html";

export class IElement extends CoreIElement {
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export class IComponent extends CoreIComponent {
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export function IFnComponent(fn) { return iFnComponentCore(fn, IElement); }
