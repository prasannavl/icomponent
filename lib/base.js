// An ultra-light weight, super-simple component for the modern
// DOM that implements a very minimal custom element.
export class LiteElement extends HTMLElement {
    constructor() {
        super();
        this.renderQueueToken = null;
        // Provide an early binding since this can get passed
        // into RenderManager scheduler repeatedly.
        this.renderNow = this.renderNow.bind(this);
    }

    // Simply returns the next view representation.
    // It's recommended to have this as a pure function.
    view() { }
    
    // After render method, executed immediately after rendering.
    rendered() { }

    // When element is a part of the DOM tree.
    // called by connectedCallback. Default action is to queue a 
    // render.
    load() { this.queueRender(); }
    
    // When element is removed from the DOM tree.
    // called by disconnectedCallback. Default action is to clear any 
    // scheduled renders.
    unload() { this.clearRenderQueue(); }
    
    // Called by adoptedCallback. Default action is to queue a 
    // render.
    adopted() { this.queueRender(); }

    // Called by attributeChangedCallback. Default action is to queue a 
    // render.
    attrChanged(name, oldVal, newVal) { this.queueRender(); }

    // Provide the root for the rendering. By default, it provides back the 
    // element itself (self). If a Shadow DOM is used/needed, then this
    // method can be overridden to return the shadow root instead.
    getRenderRoot() { return this; }

    // Render immediately.
    renderNow() {
        this.clearRenderQueue();
        this._render();
        this.rendered();
    }

    // Queue a render using the RenderManager scheduler.
    queueRender() {
        if (this.renderQueueToken !== null) return;
        this.renderQueueToken = RenderManager.schedule(this.renderNow);
    }

    // Clear any previously scheduled render using the RenderManager scheduler.
    clearRenderQueue() {
        if (this.renderQueueToken === null) return;
        RenderManager.cancel(this.renderQueueToken);
        this.renderQueueToken = null;
    }

    /// Lifecycle connections

    connectedCallback() { this.load() }
    disconnectedCallback() { this.unload() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name, oldValue, newValue) { this.attrChanged(name, oldValue, newValue) }

    // Default impl of render, delegated to the RenderManager.
    // This internal method can be overriden to provide custom render impls locally,
    // while retaining the RenderManager semantics globally.
    _render() { 
        RenderManager.render(this.view(), this.getRenderRoot());
    }
}

// A component with a minimal opinion on how to handle state, providing
// two tiny additions: the update, and dispatch method, with no other
// changes or overhead.
export class LiteComponent extends LiteElement {
    constructor() {
        super();
        // This is bound early for convenience,
        // to be able to use in jsx/template html events.
        this.dispatch = this.dispatch.bind(this);
    }

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

// A functional helper that converts plain function into a 
// LiteElement. Note that this has one additional behavior, 
// where it passes in the actual DOM attributes as 
// arguments to the functions.
export function LiteFn(fn) {
    if (!fn) throw new TypeError("invalid fn");
    return class extends LiteElement {
        view() {
            return fn(this.attributes);
        }
    }
}

export const RenderManager = function () {
    //  The default renderer, it's noop. Let the application provide
    // a renderer.
    let render = function (view, root) { };
        // We already assume HTMLElement, so it's makes so sense testing for window and such.
    let schedule = window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout;
    let cancel = window.cancelAnimationFrame ? window.cancelAnimationFrame : clearTimeout;
    
    schedule = schedule.bind(this);
    cancel = cancel.bind(this);

    return { render, schedule, cancel };
}();