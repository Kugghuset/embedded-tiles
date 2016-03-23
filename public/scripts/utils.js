'use strict'

import Promise from 'bluebird';
import { ajax } from 'jquery';
import { isNumber, isString, isFunction, isUndefined, assign } from 'lodash';
import { getToken } from './auth';

/**
 * @param {String} method The request verb, case insensitive
 * @param {String} url The url to where the request will be made
 * @param {Object} data The data which will be sent as the body of the request, not required
 * @param {Object} options Optional options object
 * @return {Promise} -> {Any}
 */
const _request = (method, url, data, options) => new Promise((resolve, reject) => {
  // Ensure uppercase
  let _method = isString(method)
    ? method.toUpperCase()
    : 'GET';

  // Assign the default options
  let _options = assign({
  }, options, {
    headers: assign({}, {
      authorization: 'Bearer ' + getToken(),
    }, (options || {}).headers)
  });

  ajax({
    url: url,
    type: _method,
    headers: _options.headers,
    data: data,
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
 * Makes a get request to *url* and returns a promise of the response.
 *
 * @param {String} url Url to make the GET request to
 * @param {Object} options Optional options object
 * @return {Promise} -> {Any}
 */
export const get = (url, options) => new Promise((resolve, reject) => {
  _request('GET', url, {}, options)
  .then(resolve)
  ['catch'](reject);
});

/**
 * Makes a PUT request to *url* and returns a promise of the response.
 *
 * @param {String} url Url to make the PUT request to
 * @param {Object} data The data to PUT
 * @param {Object} options Optional options object
 * @return {Promise} -> {Any}
 */
export const put = (url, data, options) => new Promise((resolve, reject) => {
  _request('PUT', url, data, options)
  .then(resolve)
  ['catch'](reject);
});

/**
 * Makes a POST request to *url* and returns a promise of the response.
 *
 * @param {String} url Url to make the POST request to
 * @param {Object} data The data to POST
 * @param {Object} options Optional options object
 * @return {Promise} -> {Any}
 */
export const post = (url, data, options) => new Promise((resolve, reject) => {
  _request('POST', url, data, options)
  .then(resolve)
  ['catch'](reject);
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

/**
 * Returns the relative width to parent (currently only percentage) or actual width if (if px based).
 *
 * @param {Object} parent The parent object to calculate relative width from
 * @param {String|Number} width The width to do calculations on
 * @return {Number} ex. 12
 */
export const getWidth = (parent, width) => {
  // Assume a plain number is pixels
  if (isNumber(width)) { return width; }

  // If width is incorrect, -1 is returned
  if (!isString(width)) { return -1; }

  // Handle pixels
  if (/px$/i.test(width.replace(/[^a-ö]/gi, ''))) {
    // First get the match object
    let _nums = parseFloat(width);

    // If _numMatch isn't null, return the 0th item,
    // otherwise return -1
    return !isNaN(_nums)
      ? _nums
      : -1;
  }

  // Handle percentages
  if (/%/.test(width)) {
    // First get the match object
    let _percentage = parseFloat(width);

    // If NaN, return -1
    if (isNaN(_percentage)) { return -1; }

    // Get the inner widht
    let innerWidth = isFunction($(parent).innerWidth)
      ? $(parent).innerWidth()
      : $(document).innerWidth();

    return ((_percentage / 100) * innerWidth);
  }

  return -1;
}

/**
 * Gets the DOM element to use with SpreadJS from either a DOM element, jQuery object or queryString.
 *
 * @param {Element|Object|String} element Either the actual element, a jQuery object or the queryString for the element
 * @return {Element}
 */
export const getElement = (element) => {
    let _element;

    if (_.isString(element)) {
        // If it's a string, get the element using the querySelector with the string *element*.
        _element = document.querySelector(element);
    } else if (!!element && !!element[0]) {
        // Assume *element* is a jQuery object.
        _element = element[0];
    } else {
        // The *element* is most probably an actual DOM element.
        _element = element;
    }

    return _element;
}


export default {
  get: get,
  put: put,
  post: post,
  settlePromises: settlePromises,
  createEmbedUrl: createEmbedUrl,
  setupIframe: setupIframe,
  iframeContentWindow: iframeContentWindow,
  getWidth: getWidth,
  getElement: getElement,
}
