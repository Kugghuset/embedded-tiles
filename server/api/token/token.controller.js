'use strict'

import * as _ from 'lodash';

import utils from '../../utils';
import azure from '../../services/azure';

/**
 * Route: GET '/api/tiles'
 */
export const get = (req, res) => {
  azure.getTokenData()
  .then((tokenData) => res.status(200).json(tokenData))
  .catch((err) => utils.handleError(res, err));
}

export default {
  get: get
}

