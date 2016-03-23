'use strict'

import path from 'path';
import express from 'express';
import * as bodyParser from 'body-parser';
import exphbs from 'express-handlebars';

import config from './config';

const root = path.resolve();

const handlebars = exphbs.create({ defaultLayout: 'main' });
const app = express();

// Set the render engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import routes from './routes';
routes(app);

const server = app.listen(config.port, config.ip, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('App listening on %s on port %s', host, port);
});
