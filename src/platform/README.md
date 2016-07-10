# platform

`platform` folder contains platform specific files.

For example, the js files under `chrome-ext` will finally build to background.js according to webpack setting:

```js
{
  ...
  entry: {
    ...
    background:'./src/platform/chrome-ext/background.js'
  },
  output: {
    path: path.join(__dirname, 'extension_chrome/js'),
    filename: '[name].js'
  },
  ...
}
```

Similarly, files under `electron` folder goes to electron build folder.
