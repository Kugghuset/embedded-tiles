'use strict'

import * as _ from 'lodash';
import * as request from 'request';
import Promise from 'bluebird';

/**
 * Makes a GET request to the provided *url*.
 * 
 * @param {String} url Url to make the GET requests to
 * @param {Object} options Defaults to {}, options object to use in the GET request
 * @param {Boolean} assumeJson Defaults to true
 * @return {Promise} -> {Any}
 */
export const get = (url, options = {}, assumeJson = true) => {
  return new Promise((resolve, reject) => {
    // Make get get request with the options object as base.
    request.get(_.assign({}, options, {
      uri: url,
      encoding: options.encoding || null,
      headers: _.assign({}, {
        'Connection': 'keep-alive'
      }, options.headers)
    }), (err, res, body) => {
      // Reject if an error occurred.
      if (err) return reject(err);
      
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
};

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
  get: get,
  handleError: handleError
}
