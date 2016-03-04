'use strict'

// Import non module stuff
import '../style/main.scss';

window.jQuery = window.$ = require('jquery');

import utils from './utils';

// Define height and with
let _height = 400;
let _width = 600;

$(window).ready(() => {
  
  utils.get('/api/tiles')
  .then((_tiles) => {
    let tiles = _tiles.map((tile) => {
      let _embedUrl = utils.createEmbedUrl(tile.embedUrl, _height, _width);
      return utils.setupIframe(_embedUrl, _height, _width);
    });
    
    // TODO: Append and init the tiles
    // https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-integrate-a-power-bi-tile-or-report/
    
  })
  .catch((err) => {
    console.log(err);
  });
  
  
  
}, $);
