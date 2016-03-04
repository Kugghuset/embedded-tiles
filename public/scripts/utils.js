'use strict'

import Promise from 'bluebird';
import { ajax } from 'jquery';

/**
 * Makes a get request to *url* and returns a promise of the response.
 * 
 * @param {String} url Url to make the GET request to
 * @param {Object} options Optional options object
 * @return {Promise} -> {Any}
 */
export const get = (url, options) => new Promise((resolve, reject) => {
  ajax({
    url: url,
    type: 'GET',
    success: resolve,
    error: (err) => {
      reject(new Error(
        !!err.responseBody
          ? err.responseBody
          : err.responseText
        ));
    },
  });
});



/**
 * Creates the embed url for the Power BI tile and returns it.
 * 
 * @param {String} embedUrl EmbdUrl gotten from Power BI
 * @param {Number|String} height Height of the tile
 * @param {Number|String} width Width of the tile
 * @return {String}
 */
export const createEmbedUrl = (baseEmbedUrl, height, width) => {
  return [
    baseEmbedUrl,
    'height=' + height,
    'width=' + width
    ].join('&');
}

/**
 * @param {String} embedUrl The url to embed
 * @param {Number|String} height Height of the tile
 * @param {Number|String} width Width of the tile
 * @return {Object} jQuery element object
 */
export const setupIframe = (embedUrl, height, width) => {
  return $('<iframe></iframe>')
    .attr('src', embedUrl)
    .attr('height', height)
    .attr('width', width);
};

export default {
  get: get,
  createEmbedUrl: createEmbedUrl,
  setupIframe: setupIframe
}
