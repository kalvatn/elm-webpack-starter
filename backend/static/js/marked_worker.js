'use strict';

importScripts('/modules/marked/marked.min.js', '/modules/highlight/lib/highlight.js');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

onmessage = function(e) {
  marked(e.data, function(err, html) {
    if (err) {
      console.log('markdown_worker.js : error parsing markdown : ' + err)
    } else {
      postMessage(html);
    }
  });
}


