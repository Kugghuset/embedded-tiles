'use strict'

import * as _ from 'lodash';

import utils from '../../utils';
import powerBi from '../../services/powerBi';

/**
 * Route: GET '/api/tiles'
 */
export const get = (req, res) => {
  powerBi.getTiles()
  .then((tiles) => res.status(200).json(tiles))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT /api/tiles'
 */
export const showMatches = (req, res) => {
  // Assign _body
  let _body = req.body || {};

  powerBi.getTiles(_body.token, _body.dashboard, _body.tiles)
  .then((tiles) => res.status(200).json(tiles))
  .catch((err) => utils.handleError(res, err));
}

export default {
  get: get,
  showMatches: showMatches,
}

