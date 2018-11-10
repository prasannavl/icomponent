import { IFnComponent } from "./base";

export function defineTag(name, component) {
    if (component == null) nullComponentError();
    component.tag = name;
    defineComponents(component);
}

export function defineComponents(...components) {
    for (let c of components) {
        if (c == null) nullComponentError();
        if (!isPrototypeOf(c, HTMLElement)) {
            let o = c;
            c = IFnComponent(c);
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