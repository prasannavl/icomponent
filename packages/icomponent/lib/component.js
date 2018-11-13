import { Renderer } from "./renderer";

// An ultra-light weight, super-simple component
class IComponentCore {
    constructor() {
        IComponent.init(this);
    }

    /// Rendering

    // Creates a new renderer for the element. Renderer is a per-instance
    // lightweight object that schedules rendering. The actual rendering
    // can also be overridden with it's constructor.
    createRenderer() {
        return new Renderer(this);
    }

    // Simply returns the next view representation.
    // It's recommended to have this as a pure function.
    view() { }

    // Provide the root for the rendering. By default, it provides back the 
    // element itself (self). If a Shadow DOM is used/needed, then this
    // method can be overridden to return the shadow root instead.
    getRenderRoot() { return this; }

    // Render immediately.
    render() { this.renderer.render(); }
    // Queue a render using the scheduler.
    queueRender() { this.renderer.schedule(); }
    // Clear any previously scheduled render.
    clearRenderQueue() { this.renderer.cancel(); }

    /// Lifecycle

    // When element is a part of the DOM tree.
    // called by connectedCallback. Default action is to queue a 
    // render.
    connected() { this.queueRender(); }
    
    // When element is removed from the DOM tree.
    // called by disconnectedCallback. Default action is to clear any 
    // scheduled renders.
    disconnected() { this.clearRenderQueue(); }
    
    // Called by adoptedCallback. Default action is to queue a 
    // render.
    adopted() { this.queueRender(); }

    // Called by attributeChangedCallback. Default action is to queue a 
    // render.
    attributeChanged(name, oldVal, newVal) { this.queueRender(); }

    /// Lifecycle connections

    connectedCallback() { this.connected() }
    disconnectedCallback() { this.disconnected() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name, oldValue, newValue) { this.attributeChanged(name, oldValue, newValue) }

    /// State management

    // A method for handling state mutations and additional renders.
    // Takes a message and value. Returning false, prevent scheduling
    // another render. Default is to schedule another render on 
    // update. 
    // 
    // Note that scheduling and clearing renders are extremely cheap
    // as long as it's in the same cycle before renders. So, use them 
    // freely.
    update(msg, val) {
        return true;
    }

    // Ideally, designed for dispatching an message which calls the update
    // fn, through which state mutation can be handled from one place.
    dispatch(msg, val) {
        if (this.update(msg, val))
            this.queueRender();
    }
}

IComponentCore.init = function(comp) {
    comp.renderer = comp.createRenderer();
    // This is bound early for convenience,
    // to be able to use in jsx/template html events.
    comp.dispatch = comp.dispatch.bind(comp);
}

IComponentCore.makeChainExtender = function (baseType) {
    let baseProto = baseType.prototype;
    let basePropsCache = Object.getOwnPropertyNames(baseProto);
    return function (target) {
        let targetProto = target.prototype;
        for (let x of basePropsCache) {
            // If a method is already in the target, skip it.
            if (x in targetProto) continue;
            targetProto[x] = baseProto[x];
        }
    }
}

IComponentCore.extend = IComponentCore.makeChainExtender(IComponentCore);


class IComponent extends HTMLElement {
    constructor() {
        super();
        IComponentCore.init(this);
    }
}
IComponentCore.extend(IComponent);


// The core function that create IComponentFn.
// This takes the base from which IComponentFn has
// to extend.
function componentFn(fn, BaseClass) {
    if (!fn) throw new TypeError("invalid fn");
    return class extends BaseClass {
        connected() {
            // Render immediately instead of queuing so the first
            // view is immediately materialized.
            this.render();
        }
        view() {
            return fn(this.attributes);
        }
    }
}

// A functional helper that converts plain function into a 
// IComponent. Note that this has one additional behavior, 
// where it passes in the actual DOM attributes as 
// arguments to the functions.
function IComponentFn(fn) { return componentFn(fn, IHTMLComponent); }

export { IComponentCore, IComponent, IComponentFn, componentFn }