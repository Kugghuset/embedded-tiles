'use strict'

// Import non module stuff
import '../style/main.scss';

// Ensure jQuery is attached to the window.
window.jQuery = window.$ = require('jquery');

import tiles from './tiles';
import auth from './auth';

// Setup auth
auth.setup();

// Setup tiles when everything's ready
$(window).ready(tiles.setup, $);
