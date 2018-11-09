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
            let n = c.name;
            if (!n) {
                throw new TypeError("couldn't guess tag name for type");
            }
            name = "x-" + kebabCase(n);
        }
        customElements.define(name, c);
    }
}

function nullComponentError() {
    throw new TypeError("null component");
}

function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')    // get all lowercase letters that are near to uppercase ones
        .replace(/[\s_]+/g, '-')                // replace all spaces and low dash
        .toLowerCase()                          // convert to lower case
}

function isPrototypeOf(target, prototypeClass) {
    return target.prototype instanceof prototypeClass;
}