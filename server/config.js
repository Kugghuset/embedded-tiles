'use strict'

import env from 'node-env-file';
import path from 'path';
env(path.resolve(__dirname, '../.env'));

export default {
  port: process.env.PORT || 3000,
  ip: process.env.IP || 'localhost',
  azure_domain: process.env.AZURE_DOMAIN || '',
  azure_client_id: process.env.AZURE_CLIENT_ID || '',
  azure_client_username: process.env.AZURE_CLIENT_USERNAME || '',
  azure_client_password: process.env.AZURE_CLIENT_PASSWORD || '',
  app_secret: process.env.APP_SECRET || '',
}
