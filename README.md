# litecomponent

An ultralight weight HTML5 Custom Element for the modern web, that provides Component semantics with the highest possible performance, highest possible flexibility, lowest possible cognitive and abstractive overhead, depending only on the W3C standard with < 1KB size (more like 800 bytes gzipped, really).

In other words, it saves you a lot of time and headache, being super simple to learn and use, while staying future-proof.


### NPM
```
npm install litecomponent
```

It's provides both es6 modules, that can be accessed as `litecomponent/lib`, or cjs by default. Has `pkg.module` defined for es6 bundlers, like webpack. So feel free to just use `litecomponent`.

### Unpkg

To use directly, in the browser.

```js
<script src="https://unpkg.com/litecomponent@latest/dist/index.bundle.js"></script>
```

It's exported under the name `litecomponent`.

### Features

- It's super simple, and tiny. Read the source.
- It's render agnostic. Define your own render logic, if you need, but it has the boilerplate.
- It's view agnostic. Define your views in `lit-html`, `hyperhtml`, `jsx`, `document.createElement`, or even simple html strings:  Your call. (I highly recommend, and personally use `lit-html` or `hyperhtml`).
- Zero dependencies. Though you probably want to pair it with one of the above.
- It only uses W3C standards, and simply builds off Custom Elements API.
- Provides an extremely simple Elm like `suggestion` for dealing with state, but it's really upto to you.
- It's provides `queueRender`, `renderNow`, and `clearRenderQueue` - all of them do what they precisely say. No misnomer or complications like in `React` where `render` actually means, return a view. (I'd actually call it a design bug in React. It has nothing to do with rendering. It just builds a view - I'd have called it `view`).
- Explicit control of rendering. You say, when and where to render. But has very sensible automatic rendering logic that's extremely simply to understand, like when an load, update, attribute changes, etc. But everything can be overriden.
- Operates natively on the DOM. No VDOM overhead (But there's nothing stopping you from having one, should you so wish).

### Examples

#### Basic

```js
import { html, render } from "lit-html";
import { LiteComponent, RenderManager } from "litecomponent";

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


#### Functional

```js
import { html, render } from "lit-html";
import { LiteFn, RenderManager, registerTag } from "litecomponent";

RenderManager.render = render;

let nameIt = (attrs) => {
    return html`
    <div>Hello ${attrs.name.value}!</div>
    `;
}

// registerTag is just for convenience. You can also simply use:
// customElements.define("x-app", LiteFn(App));
registerTag("x-app", nameIt);

// HTML
// <html><x-app name="value"></x-app></html>
```

#### Timer

```js
import { html, render } from "lit-html";
import { LiteComponent, RenderManager } from "litecomponent";

RenderManager.render = render;

class App extends LiteComponent {
  constructor() {
      super();
      this.time = new Date();
      this.timerHandle = null;
  }

  load() {
      super.load();

      this.timerHandle = setInterval(() => {
         this.time = new Date();
         this.queueRender();
      }, 100);
      // The default algorithm uses requestAnimationFrame for scheduled renders.
      // So, doesn't matter how many times you call queueRender. It's coalesce them nicely.
      // But you can use `renderNow`, if you intend otherwise.
      // Also, you can use `clearRenderQueue` at any point if you wish to cancel any scheduled
      // renders.
  }

  unload() {
      // I wonder why most examples don't have this. Always clean up after yourself!
      // I'm not going to make this example smaller encouraging horrible coding styles.
      clearInterval(this.timerHandle);
      super.unload();
  }

  view() {
    return html`
    <div>Time is ${this.time}!</div>
    `;
  }
}



customElements.define("x-app", App);

// HTML
// <html><x-app name="value"></x-app></html>
```

#### Simple state management

```js
import { html, render } from "lit-html";
import { LiteComponent, RenderManager, register } from "litecomponent";

RenderManager.render = render;

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

  load() {
      super.load();

      this.timerHandle = setInterval(() => {
         this.dispatch("tick", new Date());
      }, 1000);

      // Ah, because we can! Also, we already know that we've already rendered
      // initial state. So no need to even schedule it again. (Note, this is still okay,
      // even if we do, DOM won't be rendered again, since `lit-html` will diff and won't
      // really apply anything to the DOM! How cool!
      this.clearRenderQueue();
  }

  unload() {
      // I wonder why most examples don't have this. Always clean up after yourself!
      // I'm not going to make this example smaller encouraging horrible coding styles.
      clearInterval(this.timerHandle);
      super.unload();
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

// Oh yeah,
App.tag = "x-app";

register(App);

// HTML
// <html><x-app></x-app></html>
```

### API

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


### Misc

- **Help. I don't see anything on the screen.** 

The default render function is a `noop`. You need to set `RenderManager.render`.
I could have a default to something else like setting innerHTML, or mutate the DOM in some way. But this way, it's explicit as you you will never see your component render if you didn't set one so cannot be mistaken. You just need to do it once.

Alternatively, you can also override `_render`, and write your own render logic.

- **Doesn't `lit-element` solve the same problem?**

No. For 2 reasons:

- First, it isn't view or renderer agnostic. `lit-html` is a fantastic project which I use all the time. But not `lit-element`. Its very well designed as well. I'd probably use it if I didn't write `litecomponent`. 

- Two: The good folks at polymer and I have completely different perspectives of what `ultralight` is. The `lit-element` project title claims it is so. But if you look at the source, every element allocates a bunch of things, and does quite a bit compared to litecomponent. While it probably is lightweight compared to many other solutions, the Rustacean in me laughs when I read `ultralight` weight -- One should probably file a bug for it's claim. It's lightweight, but that doesn't fit my definition of ultralight weight.

For instance, 
(https://github.com/Polymer/lit-element/blob/master/src/lib/updating-element.ts#L136, https://github.com/Polymer/lit-element/blob/master/src/lib/updating-element.ts#L146, https://github.com/Polymer/lit-element/blob/master/src/lib/updating-element.ts#L310) -- That's 3 Map allocations just for simply creating an element, not counting the other things it does for every component.

If you have thousands of small components, that's not "ultralight weight". Don't mistake me, `lit-element` is a great project, but it has wrong claims, and I think things can be simplified much more providing most of its benefits, with a drastically simpler model closer to the DOM itself, most importantly avoiding the cognitive overhead of abstractions.

- **React, Vue, Angular?**

Being a big fan of React for a very time, before being fed up with the cognitive overhead, some of the realizations were a full fledged VDOM, while nice - isn't needed 90% of the time. The DOM does what it does very well, and VDOM is mostly just a useless overhead for a majority of the projects out there. For the other 10%, you can actually get results way better than with React, spending that time optimizing those parts instead of bending the logic to React's paradigm, which is in many cases the opposite of the DOM's paradigm. And today, I think React is an over-engineered mess that brings about a lot of cognitive overhead - restrictive contexts, boilerplates, async rendering (you should almost never need it with WebWorkers and a good architecture) and ever growing list of libraries and tooling, and development setup, born out of frustration of one, that all accomplish the same thing.

The problems React try to solve are nothing new, and have already been solved with different models for decades in the desktop GUI space that have stood the test of time. DOM is much closer to it today, than React.

