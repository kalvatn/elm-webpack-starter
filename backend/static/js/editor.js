'use strict';

var codemirrorRoot = '/modules/codemirror';
var highlightThemeRoot = '/modules/highlight/styles/';

var scriptCache = [];

var editor;
var preview;

var editorKeymapSelect;
var editorThemeSelect;
var editorModeSelect;

var highlightThemeSelect;


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

function storageAvailable(type) {
  try {
    var storage = window[type],
    x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return false;
  }
}

const STORAGE_KEY_EDITOR_KEYMAP = "editor.keymap";
const STORAGE_KEY_EDITOR_THEME = "editor.theme";
const STORAGE_KEY_EDITOR_MODE = "editor.mode";
const STORAGE_KEY_EDITOR_CONTENTS = "editor.contents";

const STORAGE_KEY_HIGHLIGHT_THEME = "highlight.theme";

var defaults = {};

defaults[STORAGE_KEY_EDITOR_KEYMAP] = 'default';
defaults[STORAGE_KEY_EDITOR_THEME] = 'default';
defaults[STORAGE_KEY_EDITOR_MODE] = 'gfm';
defaults[STORAGE_KEY_EDITOR_CONTENTS] = '';
defaults[STORAGE_KEY_HIGHLIGHT_THEME] = 'default';

function loadSetting(key) {
  var setting = defaults[key];
  if (storageAvailable('localStorage')) {
    if (localStorage.getItem(key)) {
      setting = localStorage.getItem(key);
      console.log('loaded stored setting ' + key);
    }
  }
  return setting;
}

function saveSetting(key, value) {
  if (storageAvailable('localStorage')) {
    var fallback = defaults[key];
    if (fallback == null) {
      console.log('bad key ' + key + ' no defaults');
      return;
    }
    if (!value) {
      value = fallback;
    }
    localStorage.setItem(key, value);
  }
}

function loadEditorState() {
  editorKeymapSelect.val(loadSetting(STORAGE_KEY_EDITOR_KEYMAP));
  editorThemeSelect.val(loadSetting(STORAGE_KEY_EDITOR_THEME));
  editorModeSelect.val(loadSetting(STORAGE_KEY_EDITOR_MODE));
  highlightThemeSelect.val(loadSetting(STORAGE_KEY_HIGHLIGHT_THEME));

  var contents = loadSetting(STORAGE_KEY_EDITOR_CONTENTS);
  if (contents !== '') {
    editor.setValue(contents);
  }

  [ editorKeymapSelect, editorThemeSelect, editorModeSelect, highlightThemeSelect ].forEach(function(element) {
    element.trigger('change');
  });
}

function saveEditorContents() {
  if (storageAvailable('localStorage')) {
    saveSetting(STORAGE_KEY_EDITOR_CONTENTS, editor.getValue());
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

  var delay;
  editor.on('change', function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

}


function updatePreview() {
  if (!preview || !editor) {
    return;
  }

  var source = editor.getValue();

  if (!source) {
    preview.innerHTML = '';
    return;
  }

  $.ajax({
    type : 'POST',
    url : '/markdown/parse',
    data : { source : source },
    success: function(data, text) {
      preview.innerHTML = data;
    },
    error : function (req, status, error) {
      console.log(req.responseText);
    }
  });
}

function editorKeymapChange() {
  var keymapname = this.value;
  if (keymapname === "default") {
    editor.setOption('keyMap', keymapname);
  } else {
    var fileUrl = codemirrorRoot + '/keymap/' + keymapname + '.js';
    loadScript(fileUrl, function() {
      editor.setOption('keyMap', keymapname);
    });
  }
  saveSetting(STORAGE_KEY_EDITOR_KEYMAP, keymapname);
}

function editorThemeChange() {
  var themename = this.value;
  var file = this.value + '.css';
  if (themename !== "default") {
    $('#codemirror-theme').attr('href', codemirrorRoot + '/theme/' + file);
  } else {
    $('#codemirror-theme').attr('href', '/ss/codemirror-empty-theme.css');
  }
  editor.setOption('theme', themename);
  saveSetting(STORAGE_KEY_EDITOR_THEME, themename);
}

function highlightThemeChange() {
  var themename = this.value;
  var file = this.value + '.css';
  $('#highlight-theme').attr('href', highlightThemeRoot + file);
  saveSetting(STORAGE_KEY_HIGHLIGHT_THEME, themename);
}

function editorModeChange() {
  var modename = this.value;
  CodeMirror.requireMode(modename, function() {
    editor.setOption('mode', modename);
    saveSetting(STORAGE_KEY_EDITOR_MODE, modename);
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


function copyToClipboardFF(text) {
  window.prompt("Copy to clipboard: Ctrl C, Enter", text);
}
function copyToClipboard(text) {
  var success = true;
  var range = document.createRange();
  var selection;

  if (window.clipboardData) {
    // ie
    window.clipboardData.setData("Text", input.val());
  } else {
    var dummy = $('<div class="copy-editor-div">');
    dummy.css({
      position: "absolute",
      left:     "-1000px",
      top:      "-1000px",
    });
    dummy.text(text);
    $("body").append(dummy);
    range.selectNodeContents(dummy.get(0));
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      success = document.execCommand("copy", false, null);
    } catch (e) {
      copyToClipboardFF(input.val());
    }
    if (success) {
      dummy.remove();
    }
  }
}
$(document).ready(function () {
  preview = document.getElementById('preview');
  setupCodeMirror();

  editorKeymapSelect = $('#select-keymap');
  editorThemeSelect = $('#select-theme');
  editorModeSelect = $('#select-mode');
  highlightThemeSelect = $('#select-hl-theme');

  editorKeymapSelect.change(editorKeymapChange);
  editorThemeSelect.change(editorThemeChange);
  editorModeSelect.change(editorModeChange);
  highlightThemeSelect.change(highlightThemeChange);

  $('#save-button').on('click', saveFile);

  scrollSync($('.CodeMirror-scroll, #preview').toArray());

  $('#loading').addClass('hide');
  $('#main').removeClass('hide');
  if (storageAvailable('localStorage')) {
    loadEditorState();
    setInterval(saveEditorContents, 10000);
  }

  updatePreview();

  var copyButton = document.getElementById('copy-button');
  copyButton.addEventListener('click', function() {
    console.log('copy button clicked');
    copyToClipboard(editor.getValue());
  });

  $('#options-form').submit(false);

  document.addEventListener('copy', function(e) {
    var target = $(e.target);
    if (target.hasClass('copy-editor-div')) {
      e.clipboardData.setData('text/plain', editor.getValue());
      e.preventDefault();
      console.log('copied editor contents to clipboard');
    }
  });
});

