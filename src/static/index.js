'use strict';

require('./styles/main.scss');
global.$ = global.jQuery = require('jquery');
require('bootstrap-sass');

var Elm = require( '../elm/Main' );
Elm.Main.embed(document.getElementById('main'));
