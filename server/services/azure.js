'use strict'

import { AuthenticationContext } from 'adal-node';
import Promise from 'bluebird';
import moment from 'moment';

import config from '../config';

// Set up shorthands from config file
const _clientId = config.azure_client_id;
const _username = config.azure_client_username;
const _password = config.azure_client_password;

// Set up Power BI and Azure shorthands
const _authorityUrl = 'https://login.windows.net/' + config.azure_domain;
const _context =  new AuthenticationContext(_authorityUrl)
const _resource = 'https://analysis.windows.net/powerbi/api';

/**
 * Contains the token and refreshToken from Azure.
 * Also contains the time of expiration for the token.
 */
const _auth = {
  token: undefined,
  tokenExpiresOn: undefined,
  refreshToken: undefined
};

/**
 * Fetches the token and refreshToken from Azure,
 * populates the _auth object and then returns a promise of the _auth object.
 * 
 * @return {Promsie} -> {Object} (_auth)
 */
export const fetchToken = () => new Promise((resolve, reject) => {
  
  _context.acquireTokenWithUsernamePassword(
    _resource,
    _username,
    _password,
    _clientId,
    (err, response) => {
      // Something went wrong, reject the error
      if (err) { return reject(err); }
      
      // Set the values of _auth
      _auth.token = response.accessToken;
      _auth.tokenExpiresOn = moment(new Date(response.expiresOn)).toDate();
      _auth.refreshToken = response.refreshToken;
      
      // Resolve _auth
      resolve(_auth);
    });
  
});

/**
 * Fetches a new token via the refreshToken from Azure,
 * sets the values of _auth and then returns a promsie of the _auth object.
 * 
 * If there is no refreshToken in _auth, the regular fetchToken method is used instead.
 * 
 * @return {Promsie} -> {Object} (_auth)
 */
export const fetchTokenRefresh = () => new Promise((resolve, reject) => {
  
  // Return the regular fetchToken function if there is no refreshToken.
  if (!_auth.refreshToken) {
    return fetchToken()
      .then(resolve)
      .catch(reject);
  }
  
  _context.acquireTokenWithRefreshToken(_auth.refreshToken,
    _clientId,
    null,
    (err, response) => {
      // Something went wrong, reject the error
      if (err) { return reject(err); }
      
      // Set the values of _auth
      _auth.token = response.accessToken;
      _auth.tokenExpiresOn = moment(new Date(response.expiresOn)).toDate();
      _auth.refreshToken = response.refreshToken;
      
      resolve(_auth);
    });

});

/**
 * An alternative 
 */
const _tokenSwitch = {
  /**
   * Returns a promise of the token if it exists and isn't dead.
   * 
   * @return {Promise} -> {String}
   */
  'local': () => new Promise((resolve, reject) => {
    // Reject if there is no token in the _auth object
    if (!_auth.token) { return reject(new Error('No token in _auth object.')); }
    
    // Reject if the token is too old
    if (moment().isAfter(_auth.tokenExpiresOn)) { return reject(new Error('The token is too old.')); }
    
    // Resolve the token
    resolve(_auth.token);
    
  }),
  
  /**
   * Returns a promise of the token via the fetchTokenRefresh method if there is a refreshToken.
   * 
   * @return {Promise} -> {String}
   */
  'refresh': () => new Promise((resolve, reject) => {
    // Reject if there is no refreshToken.
    if (!_auth.refreshToken) { return reject(new Error('No refreshToken in _auth object.')); }
    
    fetchTokenRefresh()
    .then((auth) => {
      resolve(auth.token);
    })
    .catch(reject);
  }),
  
  /**
   * Returns a promise of the token using fetchToken method.
   * 
   * @return {Promise} -> {String}
   */
  'remote': () => new Promise((resolve, reject) => {
    fetchToken()
    .then((auth) => {
      resolve(auth.token);
    })
    .catch(reject);
  })
}

/**
 * Gets the token, either from the _auth object, via fetchTokenRefresh or fetchToken.
 * 
 * If 'local' fails, it will attempt to get the token via 'refresh',
 * if 'refresh' fails, it will attempt to get the token via 'remote',
 * if 'remote' fails it'll reject the error.
 * 
 * @param {String} __method The method to aquire the token. Defaults to 'local'. Valid values are 'local', 'refresh' or 'remote'
 * @return {Promise} -> {String}
 */
export const getToken = (__method = 'local') => {
  
  const _method = !!~['local', 'refresh', 'remote'].indexOf(__method)
    ? __method
    : 'remote';
  
  return _tokenSwitch[_method]()
  .then((token) => {
    // Resolve the token
    return new Promise((resolve) => resolve(token));
  })
  .catch((err) => {
    // Try use the refresh method instead
    if (_method === 'local') { return getToken('refresh'); }
    
    // Try use the remote method instead
    if (_method === 'refresh') { return getToken('remote'); }
    
    // Reject the error, as there's no fallback.
    return new Promise((resolve, reject) => reject(err));
  });
};

/**
 * Returns a promise of the *_auth* object ({ token: String, refreshToken: String, tokenExpiresOn: Date })
 * by piggy backing on fall back system used in getToken(...).
 * 
 * @param {String} _method The primary method of getting the token
 * @return {Promise} -> {Object}
 */
export const getTokenData = (_method = 'local') => new Promise((resolve, reject) => {
  // Piggy back on the logic used in getToken(...),
  // but resolve the whole _auth object instead.
  getToken(_method)
  .then((token) => resolve(_auth))
  .catch(reject);
})

export default {
  getToken: getToken,
  getTokenData: getTokenData
}
