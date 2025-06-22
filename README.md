# rollup-plugin-userscript

A Rollup plugin for defining userscript metadata blocks, suitable for use with Tampermonkey, Violentmonkey, and other userscript managers.

## Features
- Define userscript metadata blocks in your Rollup build
- Automatically generates the `@grant` metadata based on the GM API functions used
- Compatible with Tampermonkey, Violentmonkey, and more

## Installation
```bash
npm install @editor-x/rollup-plugin-userscript --save-dev
```

## Usage
Add the plugin to your `rollup.config.js`:

```js
import userscript from '@editor-x/rollup-plugin-userscript';

export default {
  // ...your config
  plugins: [
    userscript({
      // plugin options
    })
  ]
};
```

## License
MIT

