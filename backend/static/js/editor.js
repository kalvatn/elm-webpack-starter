'use strict';

var editor;
var codemirrorRoot = '/modules/codemirror'

var scriptCache = [];

var markedWorker;


function setupMarked() {

  if (typeof(Worker) !== "undefined") {
    console.log('workers supported, creating marked_worker.js');
    markedWorker = new Worker('/js/marked_worker.js');
    markedWorker.onmessage = function(e) {
      preview.innerHTML = e.data;
    };
  } else {
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
  }

}

function setupCodeMirror() {
  editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    matchBrackets: true,
    lineWrapping: false,
    cursorScrollMargin: 300,
    styleActiveLine: true,
    indentUnit: 2,
    tabSize: 2,
    mode: 'gfm',
    keyMap: 'default',
    theme: 'default'
  });

  CodeMirror.modeURL = codemirrorRoot + '/mode/%N/%N.js';

  var preview = document.getElementById('preview');
  var delay;
  editor.on('change', function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

}


function updatePreview() {

  var preview = document.getElementById('preview');
  var source = editor.getValue();
  if (markedWorker) {
    markedWorker.postMessage(source);
  } else {
    marked(source, function(err, content) {
      if (err) throw err;
      preview.innerHTML = content;
    });
  }
}

function codeMirrorKeymapChange() {
  var keyMapName = this.value;
  if (keyMapName === "default") {
    editor.setOption('keyMap', keyMapName);
  } else {
    var fileUrl = codemirrorRoot + '/keymap/' + keyMapName + '.js';
    loadScript(fileUrl, function() {
      console.log('switching keymap to ' + keyMapName);
      editor.setOption('keyMap', keyMapName);
    });
  }
}

function codeMirrorThemeChange() {
  var themename = this.value;
  var file = this.value + '.css';
  if (themename !== "default") {
    $('#codemirror-theme').attr('href', codemirrorRoot + '/theme/' + file);
  } else {
    $('#codemirror-theme').attr('href', '/ss/codemirror-empty-theme.css');
  }
  editor.setOption('theme', themename);
}

function codeMirrorModeChange() {
  var modename = this.value;
  CodeMirror.requireMode(modename, function() {
    console.log('switching mode to ' + modename);
    editor.setOption('mode', modename);
  });
}
function saveFile(e) {
  e.preventDefault();
  var content = editor.getValue();
  var filename = "editor";
  $.ajax({
    type : 'POST',
    url : '/markdown/save',
    data : { filename : filename, content : content },
    success: function(data, text) {
      console.log('saved success');
    },
    error : function (req, status, error) {
      console.log(req.responseText);
    }
  });
}

function loadScript(url, callback) {
  if (scriptCache.indexOf(url) > -1) {
    console.log(url + ' already loaded');
    callback();
  } else {
    $.ajax({
      url: url,
      dataType: 'script',
      success: function() {
        scriptCache.push(url);
        callback();
      },
      aync: true
    });
  }
}

$(document).ready(function () {
  setupMarked();
  setupCodeMirror();
  updatePreview();


  $('#select-keymap').change(codeMirrorKeymapChange);
  $('#select-theme').change(codeMirrorThemeChange);
  $('#select-mode').change(codeMirrorModeChange);

  $('#save-button').on('click', saveFile);

  $('#select-keymap').val('default');
  $('#select-theme').val('dracula');
  $('#select-mode').val('gfm');

  $('#select-keymap, #select-theme, #select-mode').toArray().forEach(function(element) {
    $(element).trigger('change');
  });



  $('.CodeMirror-scroll').addClass('scrollsync');
  $('#preview').addClass('scrollsync');
  scrollSync($('.scrollsync').toArray());

  $('#loading').addClass('hide');
  $('#main').removeClass('hide');
});



function scrollSync(elements) {
  elements.forEach(function(el) {
    el.addEventListener('scroll', function() {
      var scrollX = el.scrollLeft;
      var scrollY = el.scrollTop;

      var xRate = scrollX / (el.scrollWidth - el.clientWidth);
      var yRate = scrollY / (el.scrollHeight - el.clientHeight);
      var updateX = scrollX != el.eX;
      var updateY = scrollY != el.eY;

      el.eX = scrollX;
      el.eY = scrollY;

      elements.forEach(function(otherEl) {
        if (otherEl != el) {
          if (updateX && Math.round(otherEl.scrollLeft - (scrollX = otherEl.eX = Math.round(xRate * (otherEl.scrollWidth - otherEl.clientWidth))))) {
            otherEl.scrollLeft = scrollX;
          }
          if (updateY && Math.round(otherEl.scrollTop - (scrollY = otherEl.eY = Math.round(yRate * (otherEl.scrollHeight - otherEl.clientHeight))))) {
            otherEl.scrollTop = scrollY;
          }
        }
      });
    });
  });
}