# icomponent

A super simple, **render-agnostic**, *ultra light-weight* micro-framework for the modern web, that provides Component semantics with the highest possible flexibility, lowest possible cognitive overhead and 100% web standards compliant in **under 1KB**.

Let's you use the DOM as framework or bring your framework, use the DOM as renderer or bring your renderer, and let them all talk to each other nicely.

Compared to other similar wrappers and/or so called lightweight components, `icomponents` merely provide a consistent interface, has nothing more than a single allocation of it's own (which is the lightweight `Renderer` object), and all it does is a few function calls that V8 should optimize out in most cases, and puts you right back into your code.

## Installation

#### NPM

```
npm install icomponent
```

As of v2.0.0, only es6 modules are provided. (See [changelog](https://github.com/prasannavl/icomponent/blob/master/CHANGELOG.md#v200)). Written in TypeScript, and as such, definitions are included.

#### Currently supported adaptors

- `icomponent-lit` [[info](https://github.com/prasannavl/icomponent/tree/master/packages/icomponent-lit)]: [lit-html](https://github.com/Polymer/lit-html) 
- `icomponent-hyper` [[info](https://github.com/prasannavl/icomponent/tree/master/packages/icomponent-hyper)]: [hyperhtml](https://github.com/WebReflection/hyperHTML) 
- `icomponent-react` [[info](https://github.com/prasannavl/icomponent/tree/master/packages/icomponent-react)]: [react](https://github.com/facebook/react) 

Install the above npm packages directly, if you prefer not to use your own renderer. They generally include the upstream package as well as `icomponent` as `dependencies`.

All of the above packages provide an implementation of `Component` such as `LitComponent`, `ReactComponent`, etc. The function of these adapters are simple - `icomponent` exports `Component` that has a no-op renderer by default (which can be changed by setting `Renderer.render`), `icomponent-lit` adapter provides `LitComponent` that by default uses the `lit-html` as the renderer backend. Similarly for the others. 

They also usually re-export some handy ones from the upstream packages for convenience. The component specific README should have more information. 

Other adaptors like `Inferno`, `CycleJs` etc, should be very easy to write, but I haven't got around to doing it yet.

#### Unpkg

To use directly, in the browser.

```js
<script type="module">
  import { Component } from 'https://unpkg.com/icomponent@latest/lib/index.js';
</script>
```

For implementation specific packages, you need to have the correct packages in scope as well. You're generally better off using npm/yarn or Code Sandbox for live playground.

<!-- ##### -->

## Goals

- Provide a full fledged minimal component abstraction with full render control, as stated in the project description.
- JavaScript ecosystem today is huge with new and innovative ways of rendering popping in and out everyday. Even though `icomponent` has a core goal to stand on it's own, it's flexibility and minimal abstraction makes it ideal to be able to mix and match renderers, and use `hyperhtml`, `lit-html`, `React`, `Vue`, `Mithril`, `Inferno`, `CycleJs` etc side-by-side, package each of them as individual isolated and standards compliant web components in the same project, without worrying about one affecting the other.
- Do all of the above at no extra cost of performance, or cognitive overhead.
- While you can do this right away by providing your own `render` logic, and there are some supported adaptors mentioned above, I'd like to add more, as time permits under the same project for a more seamless experience.

<!-- ##### -->

## Features

- It's super simple, and tiny. Read the source.
- Zero dependencies.
- It's renderer and view agnostic. Define your own render logic, if you need, but it has the boilerplate.
- Define your views in `lit-html`, `hyperhtml`, `jsx`, `document.createElement`, `React.createElement` or even direct html strings:  Your call. (I highly recommend `lit-html` or `hyperhtml`). You can even use React, or Vue's renderer if full VDOM is your thing and you'd like to package them up as isolated web-components quickly. Better yet - you can use them all in the same application.
- It only uses W3C standards, and simply sits on top of the Custom Elements API providing similar conventions.
- Provides an extremely simple Elm like *suggestion* for dealing with state, but it's really upto to you.
- It's provides `queueRender`, `render`, and `clearRenderQueue` - all of them do what they precisely say. No misnomer or complications like in `React` where `render` actually means, return a view. (I'd actually call it a design bug in React. It has nothing to do with rendering. It just builds a view - I'd have called it `view`).
- Explicit control of rendering. You say, when and where to render. But has very sensible automatic rendering logic that's extremely simply to understand, like when an load, attribute changes, etc. But everything can be overriden.
- Operates natively on the DOM. There's no VDOM overhead unless you bring it with you (which you happily can, of course!)

<!-- ##### -->

## Examples

- [Raw component using innerHTML](https://github.com/prasannavl/icomponent#raw-component-using-innerhtml)
- [Raw component using appendChild/replaceChild](https://github.com/prasannavl/icomponent#raw-component-using-appendchildreplacechild)
- [Basic](https://github.com/prasannavl/icomponent#basic)
- [Basic using react](https://github.com/prasannavl/icomponent#basic-using-react)
- [Converting an existing react component into a web-component](https://github.com/prasannavl/icomponent#converting-an-existing-react-component-into-a-web-component)
- [Basic without any adaptors](https://github.com/prasannavl/icomponent#basic-without-any-adaptors)
- [Basic using localized render](https://github.com/prasannavl/icomponent#basic-using-localized-render)
- [Functional](https://github.com/prasannavl/icomponent#functional)
- [Timer](https://github.com/prasannavl/icomponent#timer)
- [Simple state management](https://github.com/prasannavl/icomponent#simple-state-management)

<!-- ##### -->

### Tips

icomponent provides the web component model. So, you can easily do things like these by just writing your own render functions:

- Raw `jsx` without `react` on native dom? Use [nativejsx](https://github.com/treycordova/nativejsx) for views, and use `document.appendChild/replaceChild` on render. Or use [jsx-dom](https://github.com/glixlur/jsx-dom).
- `jsx` using `innerHTML`: Try [vhtml](https://github.com/developit/vhtml)
- `hyperscript` and it's vdom with icomponent model? Just return your `h` from views, and use `document.appendChild/replaceChild` similar on render, very similar to jsx.
- This is exactly what the supported adaptors do. Have a look at a few of them to see how. They are super simple.

<!-- ##### -->

#### Raw component using innerHTML

While used very rarely, let's start with the raw way to do things. This does come in handy, to write low overhead static components, though I probably would use the append/replaceChild instead below.

```js
import { Component, ComponentRenderer } from "icomponent";

export class Hello extends Component {
    createRenderer() {
        return new ComponentRenderer(this, () => { this.innerHTML = this.view() });
    }

    view() {
        return "<div>Hello there!</div>"
    }
}

customElements.define("my-hello", Hello);
```

#### Raw component using appendChild/replaceChild

A little nicer, programmatic way instead of innerHTML.

```js
import { Component, ComponentRenderer } from "icomponent";

export class Hello extends Component {
    createRenderer() {
        return new ComponentRenderer(this, () => this._render());
    }
   
    _render() {
        let v = this.view();
        this.childElementCount > 0 ?
            this.replaceChild(v, this.firstElementChild!) :
            this.appendChild(v);
    }

    view() {
        let el = document.createElement("div");
        el.textContent = "Hello there!";
        return el;
    }
}

customElements.define("my-hello", Hello);
```

One could also potentially use a `NoopRenderer`, to completely bypass the rendering and control everything manually. 

#### Basic

Now to something more useful that can be used day-to-day with `lit-html` or `hyper-html`. 

Using `icomponent-lit` or `icomponent-hyper`

```js
// Both these adaptors use the exact same code. Use
// whichever you prefer and comment the other. 

import { LitComponent as Component, html } from "icomponent-lit";
// import { HyperComponent as Component, html } from "icomponent-hyper";

class App extends Component {
  view() {
        return html`
        <div>Hello world!</div>
        `;
    }
}

customElements.define("x-app", App);

// HTML
// <html><x-app></x-app></html>
```

**Note:** `icomponent-hyper` also exports hyper's `bind` and `wire`. `html` is a convenience export to retain similar semantics between hyper and lit-html.

#### Basic using react

```js
import { ReactComponent } from "icomponent-react";
import React from "react";

class App extends ReactComponent {
    
  // Yup, full goodness of react with jsx!
  // While this component is now managed by react, you can 
  // use any icomponent methods as well like `render`, 
  // `queueRender`, etc and the whole shebang.
  view() {
      return <SomeReactComponent>
        <div>Hello world!</div>
      </SomeReactComponent>;
    }
}

customElements.define("x-app", App);

// HTML
// <html><x-app></x-app></html>
```

#### Converting an existing react component into a web-component 

```js
import { ReactComponentFn } from "icomponent-react";
import React from "react";
import MySuperCoolReactComponent from "./my-component";

customElements.define("my-component", ReactComponentFn(() => MySuperCoolReactComponent));

// HTML
// <html><my-component></my-component></html>
```

Yup. That's it. One line, and you get a full `icomponent` goodness, with the react component. You can also explicitly do this as a class with your view simply returning the react component.


#### Basic without any adaptors

This is the same one, using `lit-html`, but without any adaptors, overriding the default renderer.

```js
import { Component, Renderer } from "icomponent";
import { html, render } from "lit-html";

// Set the render function. By default it's a noop.
// Set it only once per application, or alternatively, 
// override `createRenderer` function and to provide your own render fn.

// render is any function that takes one argument - the original
// component by default.
Renderer.render = (c) => render(c.view(), c.getRenderRoot());

class App extends Component {
  view() {
        return html`
        <div>Hello world!</div>
        `;
    }
}

customElements.define("x-app", App);

// HTML
// <html><x-app></x-app></html>
```

#### Basic using localized render

Same as the above, but without using any adaptor, or overriding the default renderer.
This implementation is also similar to what the adaptors do internally.

```js
import { Component, Renderer } from "icomponent";
import { html, render } from "lit-html";

class LitHtmlComponent extends Component {
   // Override this function to change any rendering logic.
   // This can use hyperhtml, React, Vue, or any custom logic
   // as desired.
    createRenderer() {
        // The icomponent-lit does the exact same thing conceptually,
        // just in a slightly more optimized way.
        return new Renderer(this, () => render(this.view(), this.getRenderRoot()));
    }
}

class App extends LitHtmlComponent {
    view() {
        return html`
        <my-nav></my-nav>
        <div>Hello world!</div>
        `;
    }
}

class Nav extends LitHtmlComponent {
    view() {
        return html`
        <nav>Oo, my nav!</nav>
        `;
    }
}
```

#### Functional

`ComponentFn` provides functional semantics. Functional components also automatically pass along the component itself as the argument.

```js

let nameIt = (comp) => {
    let attrs = comp.attributes;
    // attrs is the actual attributes object
    // given out by the DOM. (HTMLElement.attributes)
    return html`
    <div>Hello ${attrs.name.value}!</div>
    `;
}

customElements.define("hello-component", ComponentFn(nameIt));

// HTML
// <html><hello-component name="Jane"></hello-component></html>
```

Use the appropriate `ComponentFn` like `LitComponentFn`, `ReactComponentFn` etc directly if you use the supported adapters.

#### Timer

```js

class App extends LitComponent {
  constructor() {
      super();
      this.time = new Date();
      this.timerHandle = null;
  }

  // Note: connected does not mean the component is fully loaded. 
  // It just means it's connected to the DOM tree. But, if you desire
  // load semantics, just call render to finish rendering immediately.
  // Components are, by default 'predictably' lazy.
  connected() {
      super.connected();

      this.timerHandle = setInterval(() => {
         this.time = new Date();

      // The default algorithm uses requestAnimationFrame for scheduled renders.
      // So, doesn't matter how many times you call queueRender. It coalesces them as
      // expected. But you can use `render`, if you intend otherwise.
      // Also, you can use `clearRenderQueue` at any point if you wish to cancel
      // any scheduled renders.
         this.queueRender();
      }, 100);
  }

  disconnected() {
      clearInterval(this.timerHandle);
      super.disconnected();
  }

  view() {
    return html`
    <div>Time is ${this.time}!</div>
    `;
  }
}

```

#### Simple state management

```js

class App extends LitComponent {
  constructor() {
      super();
      // If you wish to be stateless, you can pass it
      // as attributes, but hey, this example is really just to showcase 
      // update, so we'll do all sorts of things -- because you can and still
      // do so, with sanity.

      this.time = new Date();
      // Let's do this, just for fun, even though the super.load, 
      // automatically queues a render. 
      this.render();
  }

  connected() {
      super.connected();

      this.timerHandle = setInterval(() => {
         this.update("tick", new Date());
      }, 1000);

      // Ah, because we can! Also, we already know that we've already rendered
      // initial state. So no need to even schedule it again. (Note, this is still okay,
      // even if we do, DOM won't be rendered again, since `lit-html` will diff and won't
      // really apply anything to the DOM! How cool!
      this.clearRenderQueue();
  }

  disconnected() {
      clearInterval(this.timerHandle);
      super.disconnected();
  }

  update(msg, val) {
      switch (msg) {
          case "tick": { this.time = val; break; }
          case "skip": { 
              // This returns, so render doesn't get scheduled.
              return;
          }
          case "evil": {
              this.querySelector("div").innerText = "HAHAHA!";
              this.render();
              return;
          }
      }
      this.queueRender();
  }

  view() {
    // If you pass it as attributes from the outside, 
    // There's no state. Simply do `this.getAttribute` here,
    // and print and render from here.
    return html`
    <div>Time is ${this.time}!</div>
    `;
  }
}

// If you'd like attrChanged to be fired, you need to set observedProperties,
// as per the DOM spec for custom elements.
// App.observedAttributes = ["value"];

```

<!-- ### -->

## API

The entire API is so tiny and simple. You're probably better of reading the source,
so you know exactly what it does internally as well.

Here's the `ComponentCore`: 

```ts
// An ultra-light weight, super-simple component
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
    update(...args: any[]): void;
}
```

Here's the actual impl: 

```ts        
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
    update(...args: any[]) { this.queueRender() }
```


And now, the `Component`, which is just an `ComponentCore` that inherits `HTMLElement`, with some convenience extras

```ts
export function makeComponent<T extends Constructor<HTMLElement>>(Base: T) {
    return class extends makeComponentCore(Base as any) {
        attr(name: string, defaultValue?: any, transform?: (val: string) => any) {
            let val = this.getAttribute(name);
            if (val == null) return defaultValue;
            return transform != null ? transform(val) : val;
        }
    } as T & Constructor<IComponent>;
}

export class Component extends makeComponent(HTMLElement) {};
```

And finally the `Renderer`:

```ts
export class Renderer implements IRenderer {
    static render: RenderFn;
    static schedule: (render: RenderFn) => RenderQueueToken;
    static cancel: (renderQueueToken: RenderQueueToken) => void;

    renderQueueToken: number | null = null;

    constructor(
        protected component: ComponentType,
        protected fn: RenderFn = Renderer.render) {
        // Provide an early binding since this can get passed
        // into the scheduler repeatedly.
        this.render = this.render.bind(this);
    }

    // Render immediately.
    render() {
        this.cancel();
        this.fn(this.component);
    }

    // Queue a render using the default scheduler.
    schedule() {
        if (this.renderQueueToken !== null) return;
        this.renderQueueToken = Renderer.schedule(this.render);
    }

    // Clear any previously scheduled render.
    cancel() {
        if (this.renderQueueToken === null) return;
        Renderer.cancel(this.renderQueueToken);
        this.renderQueueToken = null;
    }
}
```

This is all it does. So, you can swap things out as you like keeping the micro-framework agnostic.
That's it! You've almost read the entire source now. Cheers!

<!-- ### -->

## FAQ

- **I don't see anything on the screen.** 

The default render function is a `noop`.  

You have 4 options: 

- Use one of the adaptor packages directly
- Set `Renderer.render`
- Set a renderer function to `Renderer` inside `createRenderer` as `new Renderer(this, myRenderFn)` 
- Implement a fully custom `Renderer` (which isn't needed in most cases as the default renderer handles scheduling, coalescing, on `requestAnimationFrame` nicely. 

One could argue that it could have a sensible default like setting innerHTML, or mutate the DOM with `appendChild`, etc. But this way, it's explicit and will simply not render. You just need to do it once.

- **`attributesChanged` not fired**

Set `YourComponent.observedAttributes = ["my", "attrs"];`, since Custom Elements are required to set that static property as per the DOM specifications. Please take a look at the custom elements API spec for more information.

- **Uncaught TypeError: Class constructor Component cannot be invoked without 'new'**

This can happen with bundlers like `parcel`. This basically means parcel is configured incorrectly and an ES5 class is extending an ES6 class. Try adding `"browserslist: 'last 2 Chrome versions'` (which supports ES6 classes natively) to your `package.json` and check. That should confirm the issue. If you need ES5, you need configure the your bundlers to compile icomponent and it's adapters into ES5 as well.
