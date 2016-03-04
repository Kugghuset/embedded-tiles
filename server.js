'use strict'

var env = require('node-env-file');
var path = require('path');
env(path.resolve(__dirname, './.env'));

require('./.server/app');

/**
 * This file serves purely as an entry point for the application.
 */
