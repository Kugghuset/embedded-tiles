'use strict'

import utils from './utils';

// Define height and with
let _height = 400;
let _width = 600;

/**
 * Sets up the tiles in the dashboard.
 */
export const setup = () => {
  utils.settlePromises([utils.get('/api/tiles'), utils.get('/api/token')])
  .then((_data) => {
    
    let [_tiles, _tokenData] = _data;
     
    let tiles = _tiles.map((tile) => {
      let _embedUrl = utils.createEmbedUrl(tile.embedUrl, _height, _width);
      return utils.setupIframe(_embedUrl, _height, _width);
    }).map((tile) => {
      // Listen to the load event
      $(tile).on('load', () => {
        
        // Create the message
        let _message = JSON.stringify({
          action: 'loadTile',
          accessToken: _tokenData.token,
          height: _height,
          width: _width
        });
        
        // Get the iframeContent window from the tile.
        let _iframe = utils.iframeContentWindow(tile);
        
        // Post the message
        _iframe.postMessage(_message, '*');
      });
      
      return tile;
    });
    
    // Append the tiles to the mounting point.
    $('#mount-point')
      .append(tiles);
  })
  .catch((err) => {
    console.log(err);
  });
}

export default {
  setup: setup
}
