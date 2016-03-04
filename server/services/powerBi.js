'use strict'

import { AuthenticationContext } from 'adal-node';
import Promise from 'bluebird';
import _ from 'lodash';
import moment from 'moment';

import azure from './azure';
import config from '../config';
import utils from '../utils';

const _baseUrl = 'https://api.powerbi.com/v1.0/myorg';

/**
 * Lists the dashboards belonging to the logged in user.
 * 
 * @param {String} token The Azure token. Optional, if undefined, will call azure.getToken().
 * @return {Promise} -> {Array}
 */
export const listDashboards = (token) => new Promise((resolve, reject) => {
  
  // Either use the passed in token, or get one from Azure.
  (() => new Promise((resolve, reject) => {
    // If a token is passed in, use it
    if (!!token) { return resolve(token); }
    
    // Get the token from Azure instead.
    azure.getToken()
    .then(resolve)
    .catch(reject);
  }))()
  .then((token) => {
    
    let _headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    
    return utils.get(_baseUrl + '/dashboards', { headers: _headers })
  })
  .then((body) => {
    resolve(body);
  })
  .catch(reject);
  
});

export default {
  listDashboards: listDashboards
}
