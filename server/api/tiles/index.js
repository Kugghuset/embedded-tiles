'use strict'

import express from 'express';
import controller from './tiles.controller';

const router = express.Router();

router.get('/', controller.get);

export default router;
