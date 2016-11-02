'use strict';

var editor;

function setupMarked() {
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: function(code) {
      return hljs.highlightAuto(code).value;
    }

  });
}

function setupCodeMirror() {
  editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    mode: 'text/x-markdown',
    keyMap: 'vim',
    theme: 'midnight'
  });

  var delay;
  editor.on('change', function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

}
function updatePreview() {
  var preview = $('#preview');
  var source = editor.getValue();
  var html = marked(source);
  preview.html(html);
}

function codeMirrorKeymapChange() {
  var keymapName = this.value;
  console.log('keymap changed to ' + keymapName);
  editor.setOption('keyMap', keymapName);
}
function codeMirrorThemeChange() {
  var themeName = this.value;
  var cssFile = this.value + '.css';
  if (themeName !== "default") {
    $('#codemirror-theme').attr('href', '/modules/codemirror/theme/' + cssFile);
  } else {
    $('#codemirror-theme').attr('href', '/ss/codemirror-empty-theme.css');
  }
  editor.setOption('theme', themeName);
}
$(document).ready(function () {
  setupMarked();
  setupCodeMirror();


  $('select[name=option-keymap]').change(codeMirrorKeymapChange);
  $('select[name=option-theme]').change(codeMirrorThemeChange);

  $('#save-button').on('click', function(e) {
    e.preventDefault();

    var content = editor.getValue();
    var filename = "lol";
    $.ajax({
      type : 'POST',
      url : '/markdown/save',
      data : { filename : filename, content : content },
      success: function(data, text) {
        console.log('saved success');
        console.log(data);
        console.log(text);
        alert('saved success');
      },
      error : function (req, status, error) {
        console.log(req.responseText);
        console.log(status);
        console.log(error);
        alert('saved error : ' + error);
      }
    });
  });
});
