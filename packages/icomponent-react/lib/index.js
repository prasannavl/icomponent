import { render } from "react-dom";
import { IElement as CoreIElement, IComponent as CoreIComponent, iFnComponentCore } from "icomponent";

export * from "./utils";
export { createElement } from "react";
export { render } from "react-dom";

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
