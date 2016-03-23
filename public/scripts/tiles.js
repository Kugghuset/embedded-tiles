'use strict'

import { isError } from 'lodash';

import utils from './utils';
import auth from './auth';

// Define height and with
let _height = 400;
let _width = 600;

let _mount;

/**
 * Sets up the tiles in the dashboard.
 */
export const setup = () => {

  // Set _mount to the mount point
  _mount = $('#mount-point');

  // TODO: Move this to dashboard later on
  let _tilesData = {
      tiles: [
        { title: 'Antal samtal', width: utils.getPixels(_mount, '50%', 'width'), height: utils.getPixels(_mount, '50%', 'height') },
        { title: '% Väntetid under 60 sekunder', width: utils.getPixels(_mount, '50%', 'width'), height: utils.getPixels(_mount, '50%', 'height') },
        { title: 'Samtalstid och väntetid i minuter', width: utils.getPixels(_mount, '100%', 'width'), height: utils.getPixels(_mount, '50%', 'height') },
      ],
  };

  // Get both tiles and token
  utils.settlePromises([utils.put('/api/tiles', _tilesData), utils.get('/api/token')])
  .then((_data) => {

    // Handle errors
    if (_.some(_data, isError)) {
      // Return early
      return console.log(_data);
    }

    let [_tiles, _tokenData] = _data;

    let tiles = _tiles.map((tile) => {

      let height = (typeof tile.height === 'undefined')
        ? _height
        : tile.height;

      let width = (typeof tile.width === 'undefined')
        ? _width
        : tile.width;

      let _embedUrl = utils.createEmbedUrl(tile.embedUrl, height, width);
      return utils.setupIframe(_embedUrl, height, width);
    }).map((tile, i) => {
      // Get the height to pass to Power BI
      let height = (typeof _tiles[i].height === 'undefined')
        ? _height
        : _tiles[i].height;

      // Get the width to pass to Power BI
      let width = (typeof _tiles[i].width === 'undefined')
        ? _width
        : _tiles[i].width;

      // Listen to the load event
      $(tile).on('load', () => {

        // Create the message
        let _message = JSON.stringify({
          action: 'loadTile',
          accessToken: _tokenData.token,
          height: height,
          width: width
        });

        // Get the iframeContent window from the tile.
        let _iframe = utils.iframeContentWindow(tile);

        // Post the message
        _iframe.postMessage(_message, '*');

        /**
         * Use something like this to emulate updates
         */
        setInterval(() => {
          // Post the message
          _iframe.postMessage(_message, '*');
          console.log('Sending message');
        }, 5000);

      });

        $(tile).on('message', function () {
          console.log(arguments);
        })

      return tile;
    });

    // Append the tiles to the mounting point.
    $('#mount-point')
      .append(tiles);

    // window.addEventListener('message', (message) => {
    //   console.log(message);
    // }, false);
  })
  .catch((err) => {
    console.log(err);
  });
}

export default {
  setup: setup
}
