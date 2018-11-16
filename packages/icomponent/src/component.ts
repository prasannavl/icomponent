import { IRenderer, Renderer } from "./renderer";

export interface Constructor<T> {
    new(...args: any[]): T
}

export interface IComponentCore {
    /// Rendering

    // Creates a new renderer for the element. Renderer is a per-instance
    // lightweight object that schedules rendering. The actual rendering
    // can also be overridden with it's constructor.
    createRenderer(): IRenderer;

    // Simply returns the next view representation.
    // It's recommended to have this as a pure function.
    view(): any;

    // Provide the root for the rendering. By default, it provides back the 
    // element itself (self). If a Shadow DOM is used/needed, then this
    // method can be overridden to return the shadow root instead.
    getRenderRoot(): any;

    // Render immediately.
    render(): void;
    // Queue a render using the scheduler.
    queueRender(): void;
    // Clear any previously scheduled render.
    clearRenderQueue(): void;

    // Called by the renderer just before each render.
    renderBegin(): void;

    // Called by the renderer immediately after each render.
    renderEnd(): void;

    /// Lifecycle

    // When element is a part of the DOM tree.
    // called by connectedCallback. Default action is to queue a 
    // render.
    connected(): void;

    // When element is removed from the DOM tree.
    // called by disconnectedCallback. Default action is to clear any 
    // scheduled renders.
    disconnected(): void;

    // Called by adoptedCallback. Default action is to queue a
    // render.
    adopted(): void;

    // Called by attributeChangedCallback. Default action is to queue a 
    // render.
    attributeChanged(name: string, prev: string, val: string): void;
    
    /// State management

    // A method for handling state mutations and additional renders.
    // Takes a message and value. Returning false, prevent scheduling
    // another render. Default is to schedule another render on 
    // update. 
    // 
    // Note that scheduling and clearing renders are extremely cheap
    // as long as it's in the same cycle before renders. So, use them 
    // freely.
    update(msg: any, val?: any): boolean;

    // Ideally, designed for dispatching an message which calls the update
    // fn, through which state mutation can be handled from one place.
    dispatch(msg: any, val?: any): void;
}

// An ultra-light weight, super-simple component
export class ComponentCore implements IComponentCore {
    static init: (comp: any) => void;
    static makeClassExtender: <T extends Constructor<{}>, R extends Constructor<{}>>(baseType: T) => (target: R) => void;
    static extend:  <T>(target: Constructor<T>) => void;

    // @ts-ignore
    protected renderer: IRenderer;
    
    constructor() {
        ComponentCore.init(this);
    }

    createRenderer(): IRenderer {
        return new Renderer(this);
    }

    view(): any { }

    getRenderRoot() { return this; }
    render() { this.renderer.render(); }
    queueRender() { this.renderer.schedule(); }
    clearRenderQueue() { this.renderer.cancel(); }
    renderBegin() {}
    renderEnd() {}

    /// Lifecycle

    connected() { this.queueRender(); }
    disconnected() { this.clearRenderQueue(); }
    adopted() { this.queueRender(); }
    attributeChanged(name: string, prev: string, val: string) { this.queueRender(); }

    /// Lifecycle connections

    connectedCallback() { this.connected() }
    disconnectedCallback() { this.disconnected() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name: string, prev: string, val: string) { this.attributeChanged(name, prev, val) }

    update(msg: any, val?: any) {
        return true;
    }

    dispatch(msg: any, val?: any) {
        if (this.update(msg, val))
            this.queueRender();
    }
}

ComponentCore.init = function (comp: any) {
    comp.renderer = comp.createRenderer();
    // This is bound early for convenience,
    // to be able to use in jsx/template html events.
    comp.dispatch = comp.dispatch.bind(comp);
}

ComponentCore.makeClassExtender = function <T extends Constructor<{}>, R extends Constructor<{}>>(baseType: T) {
    let baseProto = baseType.prototype;
    let basePropsCache = Object.getOwnPropertyNames(baseProto);
    return function (target: R) {
        let targetProto = target.prototype;
        for (let x of basePropsCache) {
            // If a method is already in the target, skip it.
            if (x in targetProto) continue;
            targetProto[x] = baseProto[x];
        }
    }
}

ComponentCore.extend = ComponentCore.makeClassExtender(ComponentCore);

class ComponentImpl extends HTMLElement {
    constructor() {
        super();
        ComponentCore.init(this);
    }

    attr(name: string, defaultValue: any, transform: (val: string) => any) {
        let val = this.getAttribute(name);
        if (val == null) return defaultValue;
        return transform != null ? transform(val) : val;
    }
}
ComponentCore.extend(ComponentImpl);
export interface IComponent extends ComponentImpl, ComponentCore, Constructor<IComponent> { }
export const Component: IComponent = ComponentImpl as any;

// The core function that creates IComponentFn.
// This takes the base from which IComponentFn has
// to extend.

export interface IConstructableComponentCore extends Constructor<IComponentCore>, IComponentCore {}

export function componentFn<T extends IConstructableComponentCore>(fn: IComponentFn<T>, BaseClass: T): T {
    if (!fn) throw new TypeError("invalid fn");
    return class extends BaseClass {
        connected() {
            // Render immediately instead of queuing so the first
            // view is immediately materialized.
            this.render();
        }
        view(): any {
            return fn(this as any);
        }
    };
}

// A function that you can pass into ComponentFn 
export type IComponentFn<T> = (comp: T) => void;

// A functional helper that converts plain function into a 
// IComponent. Note that this has one additional behavior, 
// where it passes in the component itself as 
// arguments to the functions.
export function ComponentFn(fn: IComponentFn<IComponent>): IComponent {
    return componentFn(fn, Component);
}