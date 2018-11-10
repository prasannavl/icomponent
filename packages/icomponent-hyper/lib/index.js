import { IElement as CoreIElement, IComponent as CoreIComponent, iFnComponentCore } from "icomponent";
import { bind } from "hyperhtml";

export * from "./utils";
export { bind, wire } from "hyperhtml";

export const html = (...args) => args;

export class IElement extends CoreIElement {
    _render() {
        bind(this.getRenderRoot())(...this.view());
    }
}

export class IComponent extends CoreIComponent {
    _render() {
        bind(this.getRenderRoot())(...this.view());
    }
}

export function IFnComponent(fn) { return iFnComponentCore(fn, IElement); }
