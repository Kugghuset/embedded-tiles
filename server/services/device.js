'use strict'

import fs from 'fs';
import path from 'path';
import JsonDB from 'node-json-db';
import _ from 'lodash';

import auth from './auth';

/*******************
 *
 * TODO: Implement tile settings in device objects
 *
 ******************/

/**
 * The database object
 */
const db = new JsonDB('.db.json', true, false);

/**
 * Wraps db.getData in a try/catch like function
 * and returns the data (if nothing went wrong), or undefined if something went wrong
 *
 * @param {String} _path The path to the object, can also be dot notated
 * @param {Boolean} returnError Boolean value for whether the error should be returned or not, defaults to false
 * @return {Any}
 */
const _getData = (_path, returnError = false) => {
  let __path = (_.isString(_path) && /\./.test(_path) && !/\//.test(_path))
    ? '/' + _path.replace(/\./g, '/')
    : _path;

  if (!__path) { __path = '/'; }

  let _data = _.attempt(() => db.getData(__path));

  // If nothing went wrong, return the _data
  if (!_.isError(_data)) { return _data; }

  return returnError
    ? _data
    : undefined;
}

/**
 * @param {Object} data Device data
 * @return {Promise}
 */
export const create = (data) => {
  let _id = auth.uuid();

  // Create the default device
  let _defaultDevice = {
    dateCreated: new Date(),
  };

  // Create the device
  let _device = _.assign(_defaultDevice, data, { _id: _id, dateUpdated: new Date() });

  // Get the path
  let _path = 'devices/{_id}'.replace('{_id}', _id)

  db.push(_path, _device);

  return _device;
}

/**
 * Lists all
 *
 * @param {String} _path The path to list
 * @param {Boolean} asArray Boolean value for whether a list or an object should be returned, defaults to true
 * @param {Boolean} returnError Boolean value for whether the error should be returned or not, defaults to false
 * @return {Array}
 */
export const list = (_path, asArray = true,  returnError) => {
  return asArray
    ? _.map(_getData(_path, returnError))
    : _getData(_path, returnError);
}

/**
 * @param {Object} options The options to match
 * @param {Boolean} asArray Boolean value for whether a list or an object should be returned, defaults to true
 * @param {Boolean} returnError Boolean value for whether the error should be returned or not, defaults to false
 */
export const find = (options, asArray = true, returnError) => {
  // Get the path
  let _path = (options || {}).path;

  return _.chain(list(_path))
    .filter(_.omit(options, 'path'))
    .thru((items) => {
      return !!asArray
        ? items
        : _.reduce(items, (obj, item) => { return _.assign({}, obj, _.zipObject([item._id], [item])); });
    })
    .tap((r) => console.log(r))
    .value();
}

export default {
  create: create,
  list: list,
  find: find,
}
