'use strict'

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var spawn = require('child_process').spawn;
var shell = require('shelljs');
var chalk = require('chalk');

// Used for running the node instance
var node;

var p_json = require('./package.json');

// The server task
gulp.task('serve', function () {
  // Restarts node if it's running
  if (node) { node.kill(); }
  
  // Run the node command on the main (given in package.json) or app.js
  node = spawn('node', [(p_json.main || 'server.js')], { stdio: 'inherit' });
  
  // An error occured
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// Runs the front end building tool chain
gulp.task('build:frontend', function () {
  var c = shell.exec('npm run build:frontend').output;
  
  console.log(chalk.green(c));
  
  livereload.reload();
});

// Runs the backend building tool chain
gulp.task('build:server', function () {
  shell.exec('npm run build:server');
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(['./server/**', './server.js'], ['build:server', 'serve']);
  gulp.watch(['public/**', '!public/dist/**'], ['build:frontend']);
});

gulp.task('default', ['build:server', 'build:frontend', 'watch', 'serve'])
