import { Renderer } from "./renderer";
// An ultra-light weight, super-simple component
export class ComponentCore {
    constructor() {
        ComponentCore.init(this);
    }
    createRenderer() {
        return new Renderer(this);
    }
    view() { }
    getRenderRoot() { return this; }
    render() { this.renderer.render(); }
    queueRender() { this.renderer.schedule(); }
    clearRenderQueue() { this.renderer.cancel(); }
    renderBegin() { }
    renderEnd() { }
    /// Lifecycle
    connected() { this.queueRender(); }
    disconnected() { this.clearRenderQueue(); }
    adopted() { this.queueRender(); }
    attributeChanged(name, prev, val) { this.queueRender(); }
    /// Lifecycle connections
    connectedCallback() { this.connected(); }
    disconnectedCallback() { this.disconnected(); }
    adoptedCallback() { this.adopted(); }
    attributeChangedCallback(name, prev, val) { this.attributeChanged(name, prev, val); }
    update(msg, val) {
        return true;
    }
    dispatch(msg, val) {
        if (this.update(msg, val))
            this.queueRender();
    }
}
ComponentCore.init = function (comp) {
    comp.renderer = comp.createRenderer();
    // This is bound early for convenience,
    // to be able to use in jsx/template html events.
    comp.dispatch = comp.dispatch.bind(comp);
};
ComponentCore.makeClassExtender = function (baseType) {
    let baseProto = baseType.prototype;
    let basePropsCache = Object.getOwnPropertyNames(baseProto);
    return function (target) {
        let targetProto = target.prototype;
        for (let x of basePropsCache) {
            // If a method is already in the target, skip it.
            if (x in targetProto)
                continue;
            targetProto[x] = baseProto[x];
        }
    };
};
ComponentCore.extend = ComponentCore.makeClassExtender(ComponentCore);
class ComponentImpl extends HTMLElement {
    constructor() {
        super();
        ComponentCore.init(this);
    }
    attr(name, defaultValue, transform) {
        let val = this.getAttribute(name);
        if (val == null)
            return defaultValue;
        return transform != null ? transform(val) : val;
    }
}
ComponentCore.extend(ComponentImpl);
export const Component = ComponentImpl;
// The core function that create IComponentFn.
// This takes the base from which IComponentFn has
// to extend.
export function componentFn(fn, BaseClass) {
    if (!fn)
        throw new TypeError("invalid fn");
    return class extends BaseClass {
        connected() {
            // Render immediately instead of queuing so the first
            // view is immediately materialized.
            this.render();
        }
        view() {
            return fn(this);
        }
    };
}
// A functional helper that converts plain function into a 
// IComponent. Note that this has one additional behavior, 
// where it passes in the component itself as 
// arguments to the functions.
export function ComponentFn(fn) {
    return componentFn(fn, Component);
}
