import { IRenderer, Renderer } from "./renderer";

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
    update(msg? : any): void;
}

export type Constructor<T> = new (...args: any[]) => T;

export function makeComponentCore<T extends Constructor<any>>(Base: T) {
    return class extends Base implements IComponentCore {
        renderer: IRenderer;
        
        constructor(...args: any[]) {
            super(...args);
            this.renderer = this.createRenderer();
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
    
        connected() { this.render(); }
        disconnected() { this.clearRenderQueue(); }
        adopted() { this.queueRender(); }
        attributeChanged(name: string, prev: string, val: string) { this.queueRender(); }
    
        /// Lifecycle connections
    
        connectedCallback() { this.connected() }
        disconnectedCallback() { this.disconnected() }
        adoptedCallback() { this.adopted() }
        attributeChangedCallback(name: string, prev: string, val: string) { this.attributeChanged(name, prev, val) }
    
        /// State management
        update(msg?: any, value?: any) {}  
    }
}

export class ComponentCore extends makeComponentCore(Function) { }

// A function that you can pass into ComponentFn
export type IComponentFn<T extends IComponentCore> = (comp: T) => void;

export function makeComponentFn<F extends IComponentCore, T extends Constructor<F>>(fn: IComponentFn<F>, BaseClass: T): T {
    if (!fn) throw new TypeError("invalid fn");
    return class extends (BaseClass as any) {
        connected() {
            // Render immediately instead of queuing so the first
            // view is immediately materialized.
            this.render();
        }
        view(): any {
            return fn(this as any);
        }
    } as T;
}

export function ComponentCoreFn(fn: IComponentFn<ComponentCore>) {
    return makeComponentFn(fn, ComponentCore);
}