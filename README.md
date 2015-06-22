## metalsmith-highlight

[![Build Status](https://travis-ci.org/hbsnow/metalsmith-highlight.svg?branch=master)](https://travis-ci.org/hbsnow/metalsmith-highlight)

[metalsmith-code-highlight](https://github.com/fortes/metalsmith-code-highlight)ではハイライトには[highlight.js](https://highlightjs.org/)が使用されていますが、metalsmith-highlightでは[Prism](https://prismjs.com/)を使用しています。

### Install

[![NPM](https://nodei.co/npm/metalsmith-highlight.png)](https://nodei.co/npm/metalsmith-highlight/)

### Usage

```js
var Metalsmith = require('metalsmith');
var highlight = require('metalsmith-highlight');

var metalsmith = new Metalsmith(__dirname);
metalsmith
  .use(highlight())
  .build()
```

対応言語は[Prism](http://prismjs.com/)の一覧にあるすべての言語とAsciiDocです。

- adoc
- coffee
- cs
- hs
- js
- md
- ps1
- py
- ts
- yml

これらにはAliasが設定されているので、`<code class="lang-js">`のように書いてもハイライトされます。

### License

ISC
