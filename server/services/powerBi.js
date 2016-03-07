'use strict'

import { AuthenticationContext } from 'adal-node';
import Promise from 'bluebird';
import _ from 'lodash';
import moment from 'moment';

import azure from './azure';
import config from '../config';
import utils from '../utils';

const _baseUrl = 'https://api.powerbi.com/v1.0/myorg';
const _baseUrlBeta = 'https://api.powerbi.com/beta/myorg';

/**
 * Returns a promise of the token from Azure.
 * 
 * @param {String} token Optional token string
 * @return {Promise} -> {String}
 */
const _getToken = (token) => new Promise((resolve, reject) => {
  // If a token is passed in, use it
  if (!!token) { return resolve(token); }
  
  // Get the token from Azure instead.
  azure.getToken()
  .then(resolve)
  .catch(reject);
});

/**
 * Returns a promise of an array of all dashboards available to the logged in user.
 * 
 * @param {String} token The Azure token. Optional, if undefined, will call azure.getToken().
 * @return {Promise} -> {Array}
 */
export const listDashboards = (token) => new Promise((resolve, reject) => {
  
  // Either use the passed in token, or get one from Azure.
  _getToken(token)
  .then((token) => {
    // Set the headers for the request
    let _headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    
    return utils.get(_baseUrl + '/dashboards', { headers: _headers })
  })
  .then((body) => {
    resolve(body.value);
  })
  .catch(reject);
  
});

/**
 * Returns a promise of an array of all tiles on the dashboard.
 * 
 * @param {String} token The Azure token. Optional, if undefined, will call azure.getToken().
 * @param {String} dashboardId The ID of the dashboard to list tiles for in Power BI.
 * @return {Promise} -> {Array}
 */
export const listTiles = (token, dashboardId) => new Promise((resolve, reject) => {
  
  _getToken(token)
  .then((token) => {
    // Set the headers for the request
    let _headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    
    let _url = _baseUrlBeta + '/dashboards/{dashboard_id}/tiles'
      .replace('{dashboard_id}', dashboardId);
    
    return utils.get(_url, { headers: _headers });
  })
  .then((body) => {
    resolve(body.value)
  })
  .catch(reject);
  
});

/**
 * @param {String} token The Azure token. Optional, if undefined, will call azure.getToken().
 * @param {String} dashboard Either the name or id of the desired dashboard
 * @param {String|Array} __tiles An array of either names or ids of the tiles to view. Can also be a single string
 */
export const getTiles = (token, _dashboard, __tiles) => new Promise((resolve, rejecet) => {
  
  // First list all dashboards
  listDashboards(token)
  .then((dashboards) => {
  
    // Find the dashboardId of the dashboard matching *_dashboard* (either by id or displayName).
    let _dashboardId = (_.find(dashboards, (dashboard) => {
      return dashboard.id === _dashboard || dashboard.displayName === _dashboard;
    }) || {}).id;
    
    // Assign it to the first dashboard's id if _dashboardId is undefined
    if (!_dashboardId) { _dashboardId = (dashboards[1] || {}).id; }
    
    return listTiles(token, _dashboardId);
  })
  .then((tiles) => {
    let _tiles = _.isArray(__tiles)
      ? __tiles
      : [ __tiles ];
    
    // Set _tiles to undefined if there are no __tiles.
    if (!__tiles || !_tiles.length) { _tiles = undefined; }
    
    resolve(
      _.chain(tiles)
      // If _tiles is undefined, filter out none, otherwise filter out all non-matching tiles
      .filter((tile) => {
        return!!_tiles
          ? !!~_tiles.indexOf(tile.id) || !!~_tiles.indexOf(tile.title)
          : true;
        })
      .map((tile) => ({ title: tile.title, embedUrl: tile.embedUrl }))
      .value()
    );
    
  })
  .catch((err) => console.log(err));
});

export default {
  listDashboards: listDashboards,
  listTiles: listTiles,
  getTiles: getTiles
}
