# Architecture

與本專案相關的套件有：

* [comics-dm5](https://www.npmjs.com/package/comics-dm5)
* [isomorphic-parse](https://www.npmjs.com/package/isomorphic-parse)

ComicsReader 使用 React+Redux 架構，另有 [comics-reader-server](https://github.com/ComicsReader/reader/blob/master/server/README.md) 作為 API Proxy Server。

## Proxy Server

在新一版的 Chrome Apps 裡有著較為嚴格的 Content Security Policy，存取任何遠端資源都需要事先宣告，但卻可以 [Embed WebView][1]；然後在調了無數次 header 還有 [credential](https://davidwalsh.name/fetch) 後，仍舊無法單由 Client JavaScript 成功送 Cookie（而要以瀏覽器本身複寫），索性把寫好的爬蟲在 nodejs 上跑，再用 express 簡單搭了一個 server 出來。

[1]: https://developer.chrome.com/apps/app_external#webview
[2]: https://davidwalsh.name/fetch
[3]: http://stackoverflow.com/questions/3340797/can-an-ajax-response-set-a-cookie
