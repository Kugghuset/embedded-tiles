'use strict'

import _ from 'lodash';
import config from '../config';
import compose from 'composable-middleware';
import jwt from 'jsonwebtoken';

/**
 * Finds the token from either query params, headers or cookies
 * and return it token.
 *
 * If 'Bearer ' isn't part it of the token, it's added.
 *
 * @param {Object} req Express request object
 * @return {String}
 */
const findToken = (req, tokenOnly) => {
  // Find the token from any of these sources
  let _appToken = _.find([
    _.get(req, 'query.token'),
    _.get(req, 'query.access_token'),
    _.get(req, 'headers.token'),
    _.get(req, 'headers.authorization'),
    _.get(req, 'headers.Authorization'),
    _.get(req, 'cookies.token'),
    _.get(req, 'cookies.access_token'),
    _.get(req, 'cookies.authorization'),
    _.get(req, 'cookies.Authorization'),
  ], (token) => !!token);

  // Add Bearer if none exists
  if (!tokenOnly && _appToken && !/^Bearer /.test(_appToken)) {
    _appToken = 'Bearer ' + _appToken;
  } else if (tokenOnly && /^Bearer /.test(_appToken)) {
    _appToken = _appToken.split(' ')[1];
  }

  // Return it
  return _appToken;
}

/**
 * Signs a token and returns it.
 *
 * @param {Data} data Data to sign into the token
 * @return {String} token
 */
export const signToken = (data) => {
  return jwt.sign(data, config.app_secret, { expiresIn: 60 * 60 * 24 * 365 });
}

/**
 * Decodes a token and returns the result.
 *
 * @param {Object} req Express request object
 * @return {String} token
 */
export const decodeToken = (req) => {
  // Get the token
  let _token = _.isString(req)
    ? req
    : findToken(req);

  // Return the decoded token.
  return jwt.decode(_token, config.app_secret);
}

/**
 * Middlewhare for ensuring authentication.
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 */
export const isAuthenticated = (req, res, next) => {
  let _token;

  return compose().use(function (req, res, next) {
    // Find the token
    _token = findToken(req, true);

    // Get the decoded data
    let _decoded = decodeToken(_token);

    // Set the device data
    req.device = {
      token: _token,
      device: !!_decoded ?
        _decoded.device
        : _decoded,
    }

    // If there is no registered device, return a 401 unauthorized
    if (!req.device.device) {
      return res.status(401).send('Unauthorized');
    }

    // Carry on
    next();
  });
}

export default {
  signToken: signToken,
  decodeToken: decodeToken,
  isAuthenticated: isAuthenticated,
}
