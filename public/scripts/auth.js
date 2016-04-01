'use strict'

import utils from './utils';
import moment from 'moment';
import Promise from 'bluebird';

/**
 * The id for the update Azure timeout loop.
 *
 * @type {Number} timeout ID
 */
let _updateAzureTimeout;

/**
 * Container object for app authorization.
 */
const _appAuth = {
  /**
   * The app token
   *
   * @type {String}
   */
  token: undefined,
}

/**
 * Container object for Azure data
 */
const _azureAuth = {
  /**
   * The azure token used when sending messages to Power BI.
   *
   * @type {String}
   */
  token: undefined,
  /**
   * The date of when to update the token. Should be set to 5 minutes before tokenExpiresOn
   *
   * @type {Date}
   */
  updateAt: undefined,
  /**
   * The actual expiration date of the token.
   *
   * @type {Date}
   */
  tokenExpiresOn: undefined,
}

/**
 * Clears the timeout (if any) and set a new timeout
 * which will call fetchAzureToken at *_azureAuth.updateAt*.
 */
const delayAzureUpdate = () => {
  // Clear the timeout if there is one
  if (typeof _updateAzureTimeout != 'undefined') {
    clearTimeout(_updateAzureTimeout);
  }

  // Get the delay time.
  let delay = moment().diff(_azureAuth.updateAt);

  // Set the timeout to fetch a new azure token after the delay
  _updateAzureTimeout = setTimeout(fetchAzureToken, delay);
}

/**
 * Sets the matching auth object based on *key*.
 *
 * @param {String} key The key to what auth object to set, should be either 'azure' or 'app'
 * @parma {Object} data The data object
 * @return {Object} The auth object which was set
 */
const setLocal = (key, data) => {
  let _auth;

  if (key === 'app') {
    _appAuth.token = data.token;

    // Set the localStorage data
    localStorage.setItem('appAuth', JSON.stringify(_appAuth));

    _auth = _appAuth;
  } else if (key === 'azure') {
    _azureAuth.token = data.token;
    _azureAuth.updateAt = moment(data.tokenExpiresOn).subtract(5, 'minutes').toDate();

    // Set the localStorage data
    localStorage.setItem('azureAuth', JSON.stringify(_azureAuth));

    // Run delayAzureUpdate to keep token up to date.
    delayAzureUpdate();

    _auth = _azureAuth;
  }

  return _auth;
}

/**
 * Fetches a new azure token from the back end
 *
 * @return {Promise} -> {Object}
 */
const fetchAzureToken = () => new Promise((resolve, reject) => {
  utils.get('/api/token/refresh')
  .then((data) => {
    // Set the local auth and resolve it
    resolve(setLocal('azure', data));
  })
  ['catch'](reject);
});

/**
 * Returns a promise of the Azure Token.
 *
 * @param {Boolean} getNew Boolean for whether the token should be fetched from the server, defaults to false.
 * @return {Promise} -> {String}
 */
export const getAzureToken = (getNew = false) => {
  let azureToken;

  // If we should get a new one, fetch one from the server
  if (getNew || !(azureToken = _azureAuth.token)) { return fetchAzureToken(); }

  // Get the local version
  return new Promise((resolve, reject) => {
    resolve(_azureAuth.token);
  });
}

/**
 * Returns the app token.
 *
 * @return {String} token
 */
export const getToken = () => _appAuth.token;

/**
 * Handles the authorization by stripping the app token from the meta tag in <head> (and removing the tag).
 * and then setting the local _appAuth object.
 *
 * @return {Promise} -> {Object}
 */
export const setup = () => new Promise(function (resolve, reject) {
  // Find the token meta tag
  let _tokenElemenet = $('meta[token]');

  // Use the token
  let _token = _tokenElemenet.attr('token');

  // Delete the meta tag
  _tokenElemenet.remove();

  // Set the _appAuth object
  setLocal('app', { token: _token });
});

export default {
  getAzureToken: getAzureToken,
  getToken: getToken,
  setup: setup,
}
