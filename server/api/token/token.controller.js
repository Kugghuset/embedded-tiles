'use strict'

import * as _ from 'lodash';

import utils from '../../utils';
import azure from '../../services/azure';

/**
 * Route: GET '/api/token'
 */
export const get = (req, res) => {
  azure.getTokenData()
  .then((tokenData) => res.status(200).json(tokenData))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/token/refresh'
 */
export const refresh = (req, res) => {
  azure.getTokenData('refresh')
  .then((tokenData) => res.status(200).json(tokenData))
  .catch((err) => utils.handleError(res, err));
}

export default {
  get: get,
  refresh: refresh,
}

