'use strict'

import express from 'express';
import path from 'path';

const root = path.resolve();

export default (app) => {
  // Front end stuff
  app.use(express.static(root + '/public'));
  
  // Back end stuff
}
