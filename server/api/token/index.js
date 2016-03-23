'use strict'

import express from 'express';
import controller from './token.controller';

const router = express.Router();

router.get('/', controller.get);
router.get('/refresh', controller.refresh);

export default router;
