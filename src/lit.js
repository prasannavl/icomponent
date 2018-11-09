import { render } from "lit-html";
import { LiteComponentBase, LiteElementBase } from "./base";

export class LiteElement extends LiteElementBase {
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export class LiteComponent extends LiteComponentBase {
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export function LiteElementFn(fn) {
    if (!fn) throw new TypeError("invalid fn");
    return class extends LiteElement {
        view() {
            return fn(this.attributes);
        }
    }
}
