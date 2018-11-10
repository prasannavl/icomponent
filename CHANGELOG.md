v2.0:

**Breaking**

- The following methods have been renamed while retaining the same 
  semantics. 

  - `load` -> `connected`
  - `unload` -> `disconnected`
  - `attrChanged` -> `attributeChanged`

  This has been done to not only stay in line with DOM spec, but also
  to avoid misconceptions due to the name such as `load`. connected does not
  mean the component is fully loaded. It just means it's connected to the DOM
  tree.


v1.0.4:

**Added**

- A `render` event is now emitted on after every render. This is useful for external
  components to know when a render has occurred. This can also be used to execute
  code once on immediate next render, without having to hook into `rendered` method.
  
- The above can easily be disabled by overriding the _postRender method.
