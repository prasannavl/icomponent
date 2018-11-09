import { LiteFn } from "./base";

export function registerTag(name, component) {
    if (component == null) nullComponentError();
    component.tag = name;
    register(component);
}

export function register(...components) {
    for (let c of components) {
        if (c == null) nullComponentError();
        if (!isPrototypeOf(c, HTMLElement)) {
            console.log("fn: ", c);
            let o = c;
            c = LiteFn(c);
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