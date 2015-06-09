## metalsmith-highlight

[![Build Status](https://travis-ci.org/hbsnow/metalsmith-highlight.svg?branch=master)](https://travis-ci.org/hbsnow/metalsmith-highlight)

[metalsmith-code-highlight](https://github.com/fortes/metalsmith-code-highlight)を使うとclass名が`language-*`でないと言語の推測をしてしまう問題が発生したので作った。参考につくったのでほとんど内容は同じです。

- コードの指定がない場合の推測をしない
- class名で`lang(uage)?-*`によって種類を指定する

のがちょっと違うところ。metalsmith-asciiで変換したHTMLに適用したかった。

### Install

[![NPM](https://nodei.co/npm/metalsmith-highlight.png)](https://nodei.co/npm/metalsmith-highlight/)

### Usage

```js
var Metalsmith = require('metalsmith');
var highlight = require('metalsmith-highlight');

var metalsmith = new Metalsmith(__dirname);
metalsmith
  .use(highlight({
    tabReplace: '  ',
    classPrefix: 'hljs-'
  }))
  .build()
```

[highlight.jsのOption](http://highlightjs.readthedocs.org/en/latest/api.html#configure-options)を指定できます。

### License

ISC
