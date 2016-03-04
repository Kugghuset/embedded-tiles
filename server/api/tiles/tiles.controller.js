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

export default {
  get: get
}

