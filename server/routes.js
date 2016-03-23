'use strict'

import express from 'express';
import path from 'path';
import { isAuthenticated } from './services/auth';

const root = path.resolve();

export default (app) => {
  // Front end stuff
  app.use(express.static(root + '/public'));
  app.get('/', isAuthenticated(), require('./viewhandler').get);

  // Back end stuff
  app.use('/api/tiles', isAuthenticated(), require('./api/tiles').default);
  app.use('/api/token', isAuthenticated(), require('./api/token').default);
}
