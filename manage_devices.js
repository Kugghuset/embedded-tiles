'use strict'

var chalk = require('chalk');

var config = require('./.server/config').default;
var device = require('./.server/services/device').default;
var auth = require('./.server/services/auth').default;

// Get the args
var args = process.argv.map(function (val, index, array) { return val }).slice(2);

var options = {}
var currentKey;

// Iterate over all args to populate *options*
args.forEach(function (val) {
  // Set current key if *val* starts with -[-]
  if (/^\-+/.test(val)) {
    currentKey = val.replace(/^\-+/, '');
    // At least append the key
    return options[currentKey] = undefined;
  }

  options[currentKey] = (typeof options[currentKey] === 'undefined')
    ? val
    : options[currentKey] + ' ' + val;
})

/************************
 *
 * Command handlers
 *
 ***********************/

var _device;

// Create new device
if (options.hasOwnProperty('create')) {
  _device = device.create();
  console.log(chalk.green('Created device:'));
  print(_device);
}

// List all devices
if (options.hasOwnProperty('list')) {
  console.log(chalk.green('Listing devices'));
  print(device.list());
}

print(options)

// Generate a token
if (options.hasOwnProperty('generate-token')) {
  // Get the _id from either the newly created _device or from an _id or id option
  var _id = (!!_device && !!_device._id)
    ? _device._id
    : options._id || options.id;

  if (!_id) {
    console.log(chalk.red('Cannot generate a token, no _id provided.'));
    console.log(chalk.yellow('To generate tokens, run one of the following commands:'));
    console.log(chalk.bgWhite(chalk.black('node manage_devices.js --generate-token --_id <_id here>')));
    console.log('or');
    console.log(chalk.bgWhite(chalk.black('node manage_devices.js --generate-token --id <_id here>')));
    console.log('or');
    console.log(chalk.bgWhite(chalk.black('node manage_devices.js --generate-token --create')));
  } else {
    console.log(chalk.green('Generating a new token for device: {device}'.replace('{device}', _id)));

    /**
     * TODO: Handle non existant _ids
     */

    var _token = auth.signToken({deviceId: _id});
    console.log(chalk.green('Token generated:'));
    console.log('\n');
    console.log(chalk.bgMagenta(_token));
    console.log('\n');
  }

}

/**
 * @param {Arr|Objet} val
 */
function print(val) {
  console.log(JSON.stringify(val, null, 4));
}
