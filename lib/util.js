import { LiteElementFn } from "./lit";

export function registerTag(name, component) {
    if (component == null) nullComponentError();
    component.tag = name;
    register(component);
}

export function register(...components) {
    for (let c of components) {
        if (c == null) nullComponentError();
        if (!isPrototypeOf(c, HTMLElement)) {
            let o = c;
            c = LiteElementFn(c);
            c.tag = o.tag;
        }
        let name = c.tag;
        if (!name) {
            throw new TypeError("no tag name provided for custom component");
        }
        customElements.define(name, c);
    }
}

function nullComponentError() {
    throw new TypeError("null component");
}

function isPrototypeOf(target, prototypeClass) {
    return target.prototype instanceof prototypeClass;
}