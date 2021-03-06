SystemJS
========

[![Build Status][travis-image]][travis-url]
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/systemjs/systemjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Sponsor](https://cdn.canopytax.com/images/canopy-sponsorship.svg)](https://canopytax.github.io/post/systemjs-sponsorship/?utm_source=systemjs)

Configurable module loader enabling dynamic ES module workflows in browsers and NodeJS.

_[Try out the SystemJS 2.0 alpha release](https://github.com/systemjs/systemjs/tree/2.0)_

_SystemJS is [currently sponsored by Canopy Tax](https://canopytax.github.io/post/systemjs-sponsorship/?utm_source=systemjs)._

* [Loads any module format](docs/module-formats.md) when running the ~15KB development build.
* Loads ES modules compiled into the `System.register` module format for production with [exact circular reference and binding support](https://github.com/ModuleLoader/es6-module-loader/blob/v0.17.0/docs/circular-references-bindings.md)
* Supports RequireJS-style [map](docs/getting-started.md#map-config), [paths](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#paths), and [bundles](docs/production-workflows.md#bundle-extension) configuration.

Built with the [ES Module Loader project](https://github.com/ModuleLoader/es-module-loader), which is based on principles and APIs from the WhatWG Loader specification, modules in HTML and NodeJS.

For discussion, join the [Gitter Room](https://gitter.im/systemjs/systemjs).

Documentation
---

* [Getting Started](docs/getting-started.md)
* [Module Formats](docs/module-formats.md)
* [Production Workflows](docs/production-workflows.md)
* [Configuration API](docs/config-api.md)
* [System API](docs/system-api.md)
* [Plugins](docs/plugins.md)
* [Creating Plugins](docs/creating-plugins.md)
* [Production Build and Resolution](docs/production-build.md)

Basic Use
---

### Browser Development

```html
<script src="systemjs/dist/system.js"></script>
<script>
  SystemJS.import('/js/main.js');
</script>
```

The above will support loading all module formats.

**To load ES6 code with in-browser transpilation, one of the following transpiler plugins must be configured**:

* [Babel](https://github.com/systemjs/plugin-babel)
* [TypeScript](https://github.com/frankwallis/plugin-typescript)
* [Traceur](http://github.com/systemjs/plugin-traceur)

### Browser Production

When all modules are available as either `system`, `amd` or global module formats, and no package configurations or plugins are needed, a production-only loader can be used:

```html
<script src="systemjs/dist/system-production.js"></script>
<script>
  SystemJS.import('/js/main.js');
</script>
```

Configuration support in the production loader includes baseURL, paths, map, depCache and wasm.

### NodeJS

To load modules in NodeJS, install SystemJS with:

```
  npm install systemjs
```

If transpiling ES modules, install the transpiler plugin following the instructions from the transpiler project page.

We can then load modules equivalently in NodeJS as we do in the browser:

```javascript
var SystemJS = require('systemjs');

// loads './app.js' from the current directory
SystemJS.import('./app.js').then(function (m) {
  console.log(m);
});
```

To import a module with the NodeJS module resolution, import with `import moduleName from '@node/module-name'`.

#### Running the tests

```
  npm run build && npm run test
```

License
---

MIT

[travis-url]: https://travis-ci.org/systemjs/systemjs
[travis-image]: https://travis-ci.org/systemjs/systemjs.svg?branch=master
