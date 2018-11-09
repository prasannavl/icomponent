# litecomponent

An ultralight weight HTML5 Custom Element for the modern web, that provides Component semantics with the highest possible performance, highest possible flexibility, lowest possible cognitive and abstractive overhead, depending only on the W3C standard with < 1KB size (more like 800 bytes gzipped, really).

In other words, it saves you a lot of time and headache, being super simple to learn and use, while staying future-proof.


### NPM
```
npm install litecomponent
```

### Features

- It's super simple and tiny. Read the source.
- It's render agnostic. Define your own render logic, if you need, but it has the boilerplate.
- It's view agnostic. Define your views in `lit-html`, `hyperhtml`, `jsx`, `document.createElement`, or even simple html strings - Your call -- though I highly recommend, and personally use `lit-html` or `hyperhtml`.
- It only uses W3C standards, and simply builds off Custom Elements API.
- Provides an extremely simple Elm like `suggestion` for dealing with state, but it's really upto to you.
- It's provides `queueRender`, `renderNow`, and `clearRenderQueue` - all of them do what they precisely say. No misnomer or complications like in `React` where `render` actually means, return a view. (I'd actually call it a design bug in React. It has nothing to do with rendering. It just builds a view).
- Explicit control of rendering. You say, when and where to render. But has very sensible automatic rendering logic that's extremely simply to understand, like when an attribute changes. But everything can be overriden.
