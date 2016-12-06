# Comics Reader

<img src="http://i.imgur.com/tHWdF5a.png" width="200">

以 React/Redux/Electron 架構打造的漫畫閱讀器，可在各平臺（Windows/macOS/Linux/Chrome）使用。

[點此下載/Download Here](https://github.com/ComicsReader/app/releases/latest)

或[下載 Chrome Extension 版本](https://chrome.google.com/webstore/detail/comics-reader/bklgednckimmhomhlbdmdhffoamaafib)

## Screenshots

<img src="docs/images/reader.png?" alt="">

<img src="docs/images/collection.png?" alt="">

<img src="docs/images/search.png?" alt="">

## Build with web tools and technology

* [React.js](https://github.com/facebook/react)
* [Redux](https://github.com/reactjs/redux), [redux-saga](https://github.com/yelouafi/redux-saga), [redux-thunk](https://github.com/gaearon/redux-thunk)
* [PouchDB](https://pouchdb.com/)
* [Electron](http://electron.atom.io/)
* [動漫屋 DM5 API wrapper](https://github.com/ComicsReader/comics-dm5)

## Development

先把專案 clone 下來：

```bash
git clone https://github.com/ComicsReader/app
cd app

npm install # or run: yarn
npm run build:dll
npm run build:dev

# in a seperate tab
cd electron
npm install
npm run start
```

要注意的是 `npm run build:dll` 在套件更新時（比如升級 npm 套件版本）需要重新跑一次。

## Build

```bash
npm install
npm run build:dll
npm run build:prod

# in electron directory
cd electron
npm install
npm run dist
```

進到 `electron/dist` 目錄即是建置完的成果。

## Credits

Fork 自 [zeroshine/ComicsScroller](https://github.com/zeroshine/ComicsScroller)，以此專案為基底打造。


## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Yukai Huang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
