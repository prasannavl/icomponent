import { IElement as CoreIElement, IComponent as CoreIComponent } from "icomponent/lib";
import { iFnComponentCore } from "icomponent/lib/base";
import { render, unmountComponentAtNode } from "react-dom";

export { defineComponents, defineTag } from "./utils";
export { createElement } from "react";
export { render } from "react-dom";

export class IElement extends CoreIElement {
    disconnected() {
        unmountComponentAtNode(this.getRenderRoot());
        super.disconnected();
    }
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export class IComponent extends CoreIComponent {
    disconnected() {
        unmountComponentAtNode(this.getRenderRoot());
        super.disconnected();
    }
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export function IFnComponent(fn) { return iFnComponentCore(fn, IElement); }
