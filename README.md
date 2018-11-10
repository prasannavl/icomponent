# litecomponent

A renderer-agnostic ultralight weight `CustomElement` for the modern web, that provides Component semantics with the highest possible performance, highest possible flexibility, lowest possible cognitive and abstractive overhead, depending only on the web-component standard with <1KB size (more like 800 bytes gzipped, really).

## Installation

#### NPM
```
npm install litecomponent
```

It provides both es6 modules, that can be accessed as `litecomponent/lib`, or cjs by default. Has `pkg.module` defined for es6 bundlers, like webpack. So feel free to just use `litecomponent`.

#### Unpkg

To use directly, in the browser.

```js
<script src="https://unpkg.com/litecomponent@latest/dist/index.bundle.js"></script>
```

It's exported under the name `litecomponent`.

<!-- ##### -->

## Features

- It's super simple, and tiny. Read the source.
- It's render agnostic. Define your own render logic, if you need, but it has the boilerplate.
- It's view agnostic. Define your views in `lit-html`, `hyperhtml`, `jsx`, `document.createElement`, or even simple html strings:  Your call. (I highly recommend `lit-html` or `hyperhtml`). You can even use React, or Vue's renderer if full VDOM is your thing, better yet - you can use them all in the same application.
- Zero dependencies. Though you probably want to pair it with one of the above.
- It only uses W3C standards, and simply builds off Custom Elements API.
- Provides an extremely simple Elm like `suggestion` for dealing with state, but it's really upto to you.
- It's provides `queueRender`, `renderNow`, and `clearRenderQueue` - all of them do what they precisely say. No misnomer or complications like in `React` where `render` actually means, return a view. (I'd actually call it a design bug in React. It has nothing to do with rendering. It just builds a view - I'd have called it `view`).
- Explicit control of rendering. You say, when and where to render. But has very sensible automatic rendering logic that's extremely simply to understand, like when an load, update, attribute changes, etc. But everything can be overriden.
- Operates natively on the DOM. No VDOM overhead (But there's nothing stopping you from having one, should you so wish).

<!-- ##### -->

## Examples

#### Basic

```js
import { LiteComponent, RenderManager } from "litecomponent";
import { html, render } from "lit-html";

// Set the render function. By default it's a noop.
// Set it only once per application, or alternatively, 
// override `_render` function and write your own render logic.

// render is any function that takes two args, 
// return item of be rendered (return value of `view`), and the dom node itself.
// lit-html render function is exactly the same.
// Modify other appropriately, depending what you decide to return from the view.
RenderManager.render = render;

class App extends LiteComponent {
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

#### Same as above using localized render.

```js
import { LiteComponent } from "litecomponent";
import { html, render } from "lit-html";

class LitHtmlComponent extends LiteComponent {
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

```js

let nameIt = (attrs) => {
    // attrs is the actual attributes object
    // given out by the DOM. (HTMLElement.attributes)
    return html`
    <div>Hello ${attrs.name.value}!</div>
    `;
}

// registerTag is just for convenience. You can also simply use:
// customElements.define("x-app", LiteFn(App));
registerTag("x-app", nameIt);

// HTML
// <html><x-app name="Jane"></x-app></html>
```

#### Timer

```js

class App extends LiteComponent {
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

class App extends LiteComponent {
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

register(App);

```

<!-- ### -->

## API

The entire API is so tiny and simple. You're probably better of reading the source,
so you know exactly what it does internally as well.

Here's the `LiteElement`: 

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

    connectedCallback() { this.connected() }
    disconnectedCallback() { this.disconnected() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name, oldValue, newValue) { 
        this.attributeChanged(name, oldValue, newValue) }

    // Default impl of render, delegated to the RenderManager.
    // This internal method can be overriden to provide custom render impls locally,
    // while retaining the RenderManager semantics globally.
    _render() { 
        RenderManager.render(this.view(), this.getRenderRoot());
    }

    _postRender() {
        this.dispatchEvent(new Event("render"));
    }
```

And now, the `LiteComponent`: 

```js
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
```

And finally `RenderManager` is just a simple object with that holds some useful defaults.

```js
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

```


This is all it does. So, you can swap things out as you like keeping the micro-framework agnostic.
That's it! You've almost read the entire source now. Cheers!

<!-- ### -->

## FAQ

- **Help. I don't see anything on the screen.** 

The default render function is a `noop`. You need to set `RenderManager.render`.
One could argue that it could have a sensible default like setting innerHTML, or mutate the DOM with `appendChild`, etc. But this way, it's explicit and will simply not render. You just need to do it once.

Alternatively, you can also override `_render`, write your own render logic and make subclasses out of it. This is already shown for `lit-html` in the examples above. In the future, I'd like to consider maintaining components like `LitHtmlComponent`, `HyperHtmlComponent`, `ReactLiteComponent` as separate supported packages.


- **`attributesChanged` not fired**

Set `YourComponent.observedAttributes = ["my", "attrs"];`, since Custom Elements are required to set that static property as per the DOM specifications. Please take a look at the custom elements API spec for more information. 

- **Element not yet rendered inside the `connected` method**

The connected callback does not imply loaded. It just implies that the component is now in the DOM tree. So, if a render
is desired before any other action is performed, simply call `renderNow` which will immediately finish rendering. 
The default action of connected is to `queueRender`, so that a render is performed, but the component will not be loaded by the time connected method is called.

This provides the advantage of being lazy, and having the flexibility to act both ways.

