var domino = require('domino');
var Prism = require('./lib/prism');

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
 * @param {string} lang
 * @return {?string} Null if not found
 */
var getGrammar = function(lang) {
  if (!lang) {
    return null;
  }

  var langList = [
    'markup', 'css', 'clike', 'javascript', 'actionscript', 'apacheconf',
    'applescript', 'aspnet', 'autohotkey', 'bash', 'c', 'csharp', 'cpp',
    'coffeescript', 'css-extras', 'dart', 'eiffel', 'erlang', 'fsharp',
    'fortran', 'gherkin', 'git', 'go', 'groovy', 'haml', 'handlebars',
    'haskell', 'http', 'ini', 'jade', 'java', 'julia', 'latex', 'less',
    'lolcode', 'markdown', 'matlab', 'nasm', 'nsis', 'objectivec', 'pascal',
    'perl', 'php', 'php-extras', 'powershell', 'python', 'r', 'jsx', 'rest',
    'rip', 'ruby', 'rust', 'sas', 'sass', 'scss', 'scala', 'scheme',
    'smalltalk', 'smarty', 'sql', 'stylus', 'swift', 'twig', 'typescript',
    'vhdl', 'wiki', 'yaml', 'asciidoc'
  ];

  if(langList.indexOf(lang) >= 0) {
    return Prism.languages[lang];
  } else {
    // alias
    switch(lang) {
      case 'adoc':
        return Prism.languages.asciidoc;
      case 'coffee':
        return Prism.languages.coffeescript;
      case 'cs':
        return Prism.languages.csharp;
      case 'hs':
        return Prism.languages.haskell;
      case 'js':
        return Prism.languages.javascript;
      case 'md':
        return Prism.languages.markdown;
      case 'ps1':
        return Prism.languages.powershell;
      case 'py':
        return Prism.languages.python;
      case 'ts':
        return Prism.languages.typescript;
      case 'yml':
        return Prism.languages.yaml;
      case 'html', 'xml':
        return Prism.languages.markup;
    }
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
    var grammar = getGrammar(getLanguage(codeBlock));

    if(grammar) {
      var result = Prism.highlight(codeBlock.textContent, grammar);
      codeBlock.innerHTML = result;
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

module.exports = function() {
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
