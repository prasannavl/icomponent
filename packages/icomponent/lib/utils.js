import { IFnComponent } from "./base";

export function defineTagCore(defineFactory, name, component) {
    if (component == null) nullComponentError();
    component.tag = name;
    defineFactory(component);
}

export function defineComponentsCore(fnComponentFactory, ...components) {
    for (let c of components) {
        if (c == null) nullComponentError();
        if (!isPrototypeOf(c, HTMLElement)) {
            let o = c;
            c = fnComponentFactory(c);
            c.tag = o.tag;
        }
        let name = c.tag;
        if (!name) {
            throw new TypeError("no tag name provided for custom component");
        }
        customElements.define(name, c);
    }
}

export function defineTag(name, component) {
    defineTagCore(defineComponents, name, component);
}

export function defineComponents(...components) {
    defineComponentsCore(IFnComponent, ...components);
}


function nullComponentError() {
    throw new TypeError("null component");
}

function isPrototypeOf(target, prototypeClass) {
    return target.prototype instanceof prototypeClass;
}