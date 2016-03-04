'use strict'

import * as _ from 'lodash';
import request from 'request';
import Promise from 'bluebird';

/**
 * Makes a *method* request to the provided *url* with a body of *content*
 * and returns a promise of the response body.
 * 
 * @parma {String} method The method of which to make the request.
 * @param {String} url Url to make the GET requests to
 * @param {Object} content The conent of the body
 * @param {Object} options Defaults to {}, options object to use in the GET request
 * @param {Boolean} assumeJson Defaults to true
 * @return {Promise} -> {Any}
 */
const _request = (method, url, content, options = {}, assumeJson = true) => new Promise((resolve, reject) => {
  // Make get get request with the options object as base.
  
  let _headers = _.assign({}, {
      'Connection': 'keep-alive'
    }, options.headers);
  
  request(_.assign({}, options, {
    method: method.toLowerCase(),
    uri: url,
    body: content,
    encoding: options.encoding || null,
    headers: _headers
  }), (err, res, body) => {
    // Reject if an error occurred.
    if (err) return reject(err);
    
    // Handle errors via statuses.
    if (400 <= res.statusCode && res.statusCode <= 500) {
      
      return reject(new Error('Something went wrong with the request, status code: ' + res.statusCode + ', ' + res.statusMessage));
    }
    
    // Parse the body into a string.
    let _body = body.toString('utf8');
    
    // Return _body early as is, if not assumeJson
    if (!assumeJson) return resolve(_body);
    
    // Attempt to parse the body
    let parsed = _.attempt(() => JSON.parse(_body));
    
    // If an error occured, resolve _body, otherwise resolve the parsed content.
    resolve(
      _.isError(parsed)
          ? _body
          : parsed
    );
  });
});

/**
 * Makes a GET request to the provided *url*
 * and returns a promise of the response body.
 * 
 * @param {String} url Url to make the GET requests to
 * @param {Object} options Defaults to {}, options object to use in the GET request
 * @param {Boolean} assumeJson Defaults to true
 * @return {Promise} -> {Any}
 */
export const get = (url, options = {}, assumeJson = true) => _request('get', url, undefined, options, assumeJson);

/**
 * Makes a PUT request to the provided *url* with the body of *contents*
 * and returns a promise of the response body.
 * 
 * @param {String} url Url to make the GET requests to
 * @param {Object} content The conent of the body
 * @param {Object} options Defaults to {}, options object to use in the GET request
 * @param {Boolean} assumeJson Defaults to true
 * @return {Promise} -> {Any}
 */
export const put = (url, content, options = {}, assumeJson = true) => _request('put', content, options, assumeJson);

/**
 * Makes a POST request to the provided *url* with the body of *contents*
 * and returns a promise of the response body.
 * 
 * @param {String} url Url to make the GET requests to
 * @param {Object} content The conent of the body
 * @param {Object} options Defaults to {}, options object to use in the GET request
 * @param {Boolean} assumeJson Defaults to true
 * @return {Promise} -> {Any}
 */
export const post = (url, content, options = {}, assumeJson = true) => _request('post', content, options, assumeJson);

/**
 * Logs the error (*err*) and sends a response of 500.
 * 
 * @param {Object} res Express response object
 * @param {Error} err
 */
export const handleError = (res, err) => {
  console.log(err);
  res.status(500).send('Internal error');
};

export default {
  request: _request,
  get: get,
  put: put,
  post: post,
  handleError: handleError
}
