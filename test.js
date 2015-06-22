var assert = require('assert');
var metalsmithCodeHighlight = require('./index');

var files = {
  'bogus.jpg': {
    contents: new Buffer('<code class=lang-js>// Hi</code>')
  },
  'code.html': {
    contents: new Buffer('<code class=lang-js>// Hi</code>')
  },
  'escape.html': {
    contents: new Buffer('<code class=lang-js>true && false</code>')
  },
  'double.html': {
    contents: new Buffer(
      '<p>Hello there.</p>' +
      '<p>Inline <code class=lang-js>document.all</code></p>' +
      '<pre><code class=lang-coffee>' +
      '\nrequire "fs"\nconsole.log fs.readFileSync "/etc/passwd"' +
      '</code></pre>'
    )
  },
  'doctype.html': {
    contents: new Buffer(
      '<!DOCTYPE html>' +
      '<html>' +
      '<head><title>Test Page</title></head>' +
      '<body><pre><code class=lang-js>var x = [1, 2, 3];</code></pre></body>' +
      '</html>'
    )
  }
}

var plugin = metalsmithCodeHighlight();
plugin(files, {}, function(err) {
  assert.equal(
    files['code.html'].contents.toString(),
    '<code class="lang-js">' +
    '<span class="token comment" spellcheck="true">// Hi</span>' +
    '</code>'
  );

  assert.equal(
    files['escape.html'].contents.toString(),
    '<code class="lang-js"><span class="token keyword">true</span> ' +
    '<span class="token operator">&amp;&amp;</span> ' +
    '<span class="token keyword">false</span></code>'
  );

  assert.equal(
    files['double.html'].contents.toString(),
    ('<p>Hello there.</p>' +
    '<p>Inline <code class="lang-js">document' +
    '<span class="token punctuation">.</span>all</code></p>' +
    '<pre><code class="lang-coffee">\n' +
    'require <span class="token string">"fs"</span>\n' +
    'console<span class="token punctuation">.</span>log fs' +
    '<span class="token punctuation">.</span>readFileSync ' +
    '<span class="token string">"/etc/passwd"</span></code></pre>')
  );

  assert.equal(
    files['doctype.html'].contents.toString(),
    ('<!DOCTYPE html>\n' +
    '<html><head><title>Test Page</title></head><body><pre>' +
    '<code class="lang-js"><span class="token keyword">var</span> x ' +
    '<span class="token operator">=</span> <span class="token punctuation">[' +
    '</span><span class="token number">1</span>' +
    '<span class="token punctuation">,</span> <span class="token number">2' +
    '</span><span class="token punctuation">,</span> ' +
    '<span class="token number">3</span><span class="token punctuation">]' +
    '</span><span class="token punctuation">;</span></code></pre>' +
    '</body></html>')
  );

  // Don't touch non-HTML files
  assert.equal(
    files['bogus.jpg'].contents.toString(),
    '<code class=lang-js>// Hi</code>'
  );

  console.log('All tests passed');
});
