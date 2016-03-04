'use strict'

// Import non module stuff
import '../style/main.scss';

window.jQuery = window.$ = require('jquery');

import utils from './utils';

// Define height and with
let _height = 400;
let _width = 600;

$(window).ready(() => {
  
  const _embedUrl = utils.createEmbedUrl('http://www.w3schools.com?something=1', _height, _width);
  const _tile = utils.setupIframe(_embedUrl, _height, _width);
  
  $('#mount-point').replaceWith(_tile);


}, $);
