import { IElement as CoreIElement, IComponent as CoreIComponent, iFnComponentCore } from "icomponent";
import { bind } from "hyperhtml";

export * from "./utils";
export { bind, wire } from "hyperhtml";

export const html = (...args) => args;

export class IElement extends CoreIElement {
    constructor() {
        super();
        this._hyperRoot = null;
    }

    _render() {
        if (this._hyperRoot == null) {
            this._hyperRoot = bind(this.getRenderRoot());
        }
        this._hyperRoot(...this.view());
    }
}

export class IComponent extends CoreIComponent {
    constructor() {
        super();
        this._hyperRoot = null;
    }

    _render() {
        if (this._hyperRoot == null) {
            this._hyperRoot = bind(this.getRenderRoot());
        }
        this._hyperRoot(...this.view());
    }
}

export function IFnComponent(fn) { return iFnComponentCore(fn, IElement); }
