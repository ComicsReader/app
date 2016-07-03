# isomorphic-parse

DOM parsing for both node & browserify. A wrapped library of jquery & cheerio.

# Installation

## NPM

```
npm install --save isomorphic-parse
```

## Webpack config

If you're using webpack, you would also need the following setup from [cheerio build issue](https://github.com/cheeriojs/cheerio/pull/801).

1. install json-loader

   ```npm install --save-dev json-loader```

2. Go to your webpack config and make sure to use the "json-loader" and configure that "cheerio/package" is resolved with the "json-loader".

```js
module: {
    loaders: [
        {
            test: /cheerio\/package$/,
            loader: 'json'
        },
    ]
}
```



# Usage

```js
const $ = require('isomorphic-parse')

fetch(`some url`).then(r => r.text()).then(response => {
  var doc = $(response)
  console.log(doc.find('ul a').attr('href'))
})
```

Note that in node environment, I map cheerio constructor function to `find` like this:

```js
// index-node.js
var cheerio = require('cheerio');
cheerio.find = cheerio;
module.exports = cheerio;
```

Now in cheerio, we can use `find` method in jquery style, but it should be differed from jquery global query style,  ```$(selector)``` .



# LISENCE

MIT