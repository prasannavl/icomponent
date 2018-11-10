v1.0.4:

**Added**

- A `render` event is now emitted on after every render. This is useful for external
  components to know when a render has occurred. This can also be used to execute
  code once on immediate next render, without having to hook into `rendered` method.
  
- The above can easily be disabled by overriding the _postRender method.