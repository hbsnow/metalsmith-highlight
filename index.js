var domino = require('domino');
var highlight = require('highlight.js');

/**
 * @param {!HTMLElement} element
 * @return {?string} Null if not found
 */
var getLanguage = function(element) {
  if(element.className) {
    var match = element.className.match(/(?:^|\w)lang(uage)?-(.+)(?:$|\w)/);

    if(match) {
      return match[2];
    }
  }

  return null;
};

/**
 * @param {!string} html
 * @return {?string} Null if not found
 */
var getDocType = function(html) {
  var match = (html || '').match(/^[\s]*<!DOCTYPE ([^>]*)>/i);

  if(match) {
    return match[0];
  }

  return null;
};

/**
 * @param {!string} html
 * @return {!string} New HTML with code highlighted
 */
var highlightFile = function(html) {
  var docType = getDocType(html);
  if(docType) {
    var container = domino.createWindow(html).document;
  } else {
    var window = window || domino.createWindow('');
    var document = window.document;
    container = document.createElement('div');

    container.innerHTML = html;
  }

  var codeBlocks = container.querySelectorAll('code');
  var len;
  for(var i = 0, len = codeBlocks.length; i < len; i++) {
    var codeBlock = codeBlocks[i];
    var lang = getLanguage(codeBlock);

    if(highlight.getLanguage(lang)) {
      var result = highlight.highlight(lang, codeBlock.textContent, true);
      codeBlock.innerHTML = result.value;
    }
  }

  if(docType) {
    var finalHtml = docType + '\n' +
                    container.getElementsByTagName('html')[0].outerHTML;
  } else {
    finalHtml = container.innerHTML;
  }

  return finalHtml;
};

module.exports = function(options) {
  highlight.configure(options);

  /**
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */
  return function(files, metalsmith, done) {
    for(var file in files) {
      if (/\.html$/.test(file)) {
        var data = files[file];
        data.contents = new Buffer(highlightFile(data.contents.toString()));
      }
    }

    setImmediate(done);
  }
}
