'use strict'

// Import non module stuff
import '../style/main.scss';

window.jQuery = window.$ = require('jquery');

import utils from './utils';
import tiles from './tiles';

$(window).ready(tiles.setup, $);
