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
 * Runs all *promises* and resolves when all are finished.
 * 
 * @param {Array} promises Array of promises
 * @return {Promise}
 */
export const settlePromises = (promises) => new Promise((resolve, reject) => {
  Promise.all(promises.map((promise) => promise.reflect()))
  .then((vals) => resolve(vals.map((val) => val.isRejected() ? val.reason() : val.value())))
  .catch(reject);
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

/**
 * Returns the contentWindow of an iframe.
 * 
 * @param {Element|JQuery} _iframe Either a jQuery object or Element
 * @return {Object}
 */
export const iframeContentWindow = (_iframe) => {
  // Return an empty object if there's no _iframe
  if (!_iframe) { return {}; }
  
  // If there's something at [0], then it's _probably_ a jQuery object.
  let iframe = !!_iframe[0]
    ? _iframe[0]
    : _iframe;
  
  return !!iframe.contentWindow
    ? iframe.contentWindow
    : iframe.contentDocument.defaultView;
}

export default {
  get: get,
  settlePromises: settlePromises,
  createEmbedUrl: createEmbedUrl,
  setupIframe: setupIframe,
  iframeContentWindow: iframeContentWindow
}
