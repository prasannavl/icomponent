# icomponent

(Formerly, litecomponent)

A renderer-agnostic ultralight weight `CustomElement` for the modern web, that provides Component semantics with the highest possible performance, highest possible flexibility, lowest possible cognitive and abstractive overhead, depending only on the web-component standard with <1KB size (more like 800 bytes gzipped, really).

## Installation

#### NPM

```
npm install icomponent
```

It provides both es6 modules, that can be accessed as `icomponent/lib`, or cjs by default. Has `pkg.module` defined for es6 bundlers, like webpack. So feel free to just use `icomponent`.

## Currently supported adaptors

- `icomponent-lit` [[info](https://github.com/prasannavl/icomponent/tree/master/packages/icomponent-lit)]: [lit-html](https://github.com/Polymer/lit-html) implementation
- `icomponent-hyper` [[info](https://github.com/prasannavl/icomponent/tree/master/packages/icomponent-hyper)]: [hyperhtml](https://github.com/WebReflection/hyperHTML)

Install the above npm packages directly, if you prefer not to use your own renderer. They generally include the upstream package as well as `icomponent` as `peer dependencies`.

All of the above packages provide an exact interface as `icomponent`. That is, `icomponent` exports `IComponent` that has a no-op renderer by default that can configured with `IDefault`. `icomponent-lit` provides `IComponent` that by default uses the `lit-html` as the renderer backend. Similarly for the others. 

They also usually re-export some handy ones from the upstream packages for convenience. The component specific README should have more information. 

Other adaptors like `React`, `Inferno`, `CycleJs` etc, should be very easy to write, but I haven't got around to doing it yet.

#### Unpkg

To use directly, in the browser.

```js
<script type="module">
  import { IComponent, defineTag } from 'https://unpkg.com/icomponent@latest/lib/index.js';
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
- It's provides `queueRender`, `renderNow`, and `clearRenderQueue` - all of them do what they precisely say. No misnomer or complications like in `React` where `render` actually means, return a view. (I'd actually call it a design bug in React. It has nothing to do with rendering. It just builds a view - I'd have called it `view`).
- Explicit control of rendering. You say, when and where to render. But has very sensible automatic rendering logic that's extremely simply to understand, like when an load, update, attribute changes, etc. But everything can be overriden.
- Operates natively on the DOM. There's no VDOM overhead unless you bring it with you (which you happily can, of course!)

<!-- ##### -->

## Examples

#### Basic

Using `icomponent-lit` or `icomponent-hyper`

```js
// Both these adaptors use the exact same code. Use
// whichever you prefer and comment the other. 

// import { IComponent, html } from "icomponent-lit";
import { IComponent, html } from "icomponent-hyper";

class App extends IComponent {
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

#### Basic without any adaptors

This is the same one, using `lit-html`, but without any adaptors, overriding the default renderer.

```js
import { IComponent, IDefault } from "icomponent";
import { html, render } from "lit-html";

// Set the render function. By default it's a noop.
// Set it only once per application, or alternatively, 
// override `_render` function and write your own render logic.

// render is any function that takes two args, 
// return item of be rendered (return value of `view`), and the dom node itself.
// lit-html render function is exactly the same.
// Modify other appropriately, depending what you decide to return from the view.
IDefault.render = render;

class App extends IComponent {
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
import { IComponent } from "icomponent";
import { html, render } from "lit-html";

class LitHtmlComponent extends IComponent {
   // Override this function to change any rendering logic.
   // This can use hyperhtml, React, Vue, or any custom logic
   // as desired.
    _render() {
        render(this.view(), this.getRenderRoot());
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

`IFnComponent` provides functional semantics. Functional components also automatically pass along the DOM attributes as arguments.

```js

let nameIt = (attrs) => {
    // attrs is the actual attributes object
    // given out by the DOM. (HTMLElement.attributes)
    return html`
    <div>Hello ${attrs.name.value}!</div>
    `;
}

// defineTag is just for convenience. You can also simply use:
// customElements.define("hello-component", IFnComponent(nameIt));
defineTag("hello-component", nameIt);

// HTML
// <html><hello-component name="Jane"></hello-component></html>
```

#### Timer

```js

class App extends IComponent {
  constructor() {
      super();
      this.time = new Date();
      this.timerHandle = null;
  }

  // Note: connected does not mean the component is fully loaded. 
  // It just means it's connected to the DOM tree. But, if you desire
  // load semantics, just call renderNow to finish rendering immediately.
  // Components are, by default 'predictably' lazy.
  connected() {
      super.connected();

      this.timerHandle = setInterval(() => {
         this.time = new Date();

      // The default algorithm uses requestAnimationFrame for scheduled renders.
      // So, doesn't matter how many times you call queueRender. It coalesces them as
      // expected. But you can use `renderNow`, if you intend otherwise.
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

class App extends IComponent {
  constructor() {
      super();
      // If you wish to be stateless, you can pass it
      // as attributes, but hey, this example is really just to showcase 
      // update, so we'll do all sorts of things -- because you can and still
      // do so, with sanity.

      this.time = new Date();
      // Let's do this, just for fun, even though the super.load, 
      // automatically queues a render. 
      this.renderNow();
  }

  connected() {
      super.connected();

      this.timerHandle = setInterval(() => {
         this.dispatch("tick", new Date());
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
              // This returns false, so render doesn't get scheduled.
              return false;
          }
          case "evil": {
              this.querySelector("div").innerText = "HAHAHA!";
              this.renderNow();
              return false;
          }
      }
      return super.update();
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

// Oh yeah, you can do this as well.
App.tag = "x-app";

defineComponents(App);

```

<!-- ### -->

## API

The entire API is so tiny and simple. You're probably better of reading the source,
so you know exactly what it does internally as well.

Here's the `IElement`: 

```js

    // Simply returns the next view representation.
    // It's recommended to have this as a pure function.
    view() { }
    
    // After render method, executed immediately after rendering.
    rendered() { }

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

    // Provide the root for the rendering. By default, it provides back the 
    // element itself (self). If a Shadow DOM is used/needed, then this
    // method can be overridden to return the shadow root instead.
    getRenderRoot() { return this; }

    // Render immediately.
    renderNow() {
        this.clearRenderQueue();
        this._render();
        this.rendered();
        this._postRender();
    }

    // Queue a render using the IDefault scheduler.
    queueRender() {
        if (this.renderQueueToken !== null) return;
        this.renderQueueToken = IDefault.schedule(this.renderNow);
    }

    // Clear any previously scheduled render using the IDefault scheduler.
    clearRenderQueue() {
        if (this.renderQueueToken === null) return;
        IDefault.cancel(this.renderQueueToken);
        this.renderQueueToken = null;
    }

    /// Lifecycle connections

    connectedCallback() { this.connected() }
    disconnectedCallback() { this.disconnected() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name, oldValue, newValue) { 
        this.attributeChanged(name, oldValue, newValue) }

    // Default impl of render, delegated to the IDefault.
    // This internal method can be overriden to provide custom render impls locally,
    // while retaining the IDefault semantics globally.
    _render() { 
        IDefault.render(this.view(), this.getRenderRoot());
    }

    _postRender() {
        this.dispatchEvent(new Event("render"));
    }
```

And now, the `IComponent`: 

```js
// A component with a minimal opinion on how to handle state, providing
// two tiny additions: the update, and dispatch method, with no other
// changes or overhead.
export class IComponent extends IElement {
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
```

And finally `IDefault` is just a simple object with that holds some useful defaults.

```js
export const IDefault = function () {
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

```


This is all it does. So, you can swap things out as you like keeping the micro-framework agnostic.
That's it! You've almost read the entire source now. Cheers!

<!-- ### -->

## FAQ

- **Help. I don't see anything on the screen.** 

The default render function is a `noop`.  

You have 3 options: 

- Use one of the adaptor packages directly
- Set `IDefault.render` 
- Implement `_render`

One could argue that it could have a sensible default like setting innerHTML, or mutate the DOM with `appendChild`, etc. But this way, it's explicit and will simply not render. You just need to do it once.

Alternatively, you can also override `_render`, write your own render logic and make subclasses out of it. This is already shown for `lit-html` in the examples above.


- **`attributesChanged` not fired**

Set `YourComponent.observedAttributes = ["my", "attrs"];`, since Custom Elements are required to set that static property as per the DOM specifications. Please take a look at the custom elements API spec for more information. 

- **Element not yet rendered inside the `connected` method**

The connected callback does not imply loaded. It just implies that the component is now in the DOM tree. So, if a render
is desired before any other action is performed, simply call `renderNow` which will immediately finish rendering. 
The default action of connected is to `queueRender`, so that a render is performed, but the component will not be loaded by the time connected method is called.

This provides the advantage of being lazy, and having the flexibility to act both ways.

