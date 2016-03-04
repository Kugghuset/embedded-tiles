'use strict'

var env = require('node-env-file');
var path = require('path');
env(path.resolve(__dirname, '../.env'));

export default {
  port: process.env.PORT || 3000,
  ip: process.env.IP || 'localhost',
  azure_domain: process.env.AZURE_DOMAIN || '',
  azure_client_id: process.env.azure_client_id || '',
  azure_client_username: process.env.AZURE_CLIENT_USERNAME || '',
  azure_client_password: process.env.AZURE_CLIENT_PASSWORD || ''
}
