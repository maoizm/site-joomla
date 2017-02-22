/**
 *
 * Test functions
 *
 * Run these by:
 *   $ npm run test
 *
 * Created by mao on 22.02.2017.
 */

/* Gulp and other dependencies */
const gulp=require('gulp');
const $ = require('gulp-load-plugins')();

const loggy = require('../../.gulp/helpers').loggy;
const stringly = require('../../.gulp/helpers').stringly;

const del = require('del');
const globby = require('globby');
const fs = require('fs');
const path = require('path');


/* Fetch and prepare configuration */
const cfg = require('./cfg');
const run = cfg.run;
const taskCfg = cfg.task_config;
const browserSync = cfg.browserSync;



/* Helpers & utilities for testing purposes */

const printfiles = path =>
  globby([path]).then( paths => {
    paths.forEach( name => {
      const stat = fs.statSync(name);
      const t = new Date(stat.mtime);
      const pad = n => `${'0'.repeat( n<10 ? 1 : 0)}${n}`;
      console.log(`${name} ${' '.repeat(30-name.length)} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`);
    })
  });


/**
 * Promised timeout
 *
 * Usage:
 *
 *       delay(50)
 *         .then(()=>console.log('start 1'))
 *         .then(()=>delay(300))
 *         .then(()=>console.log('finish 1'))
 *         .then(()=>delay(250))
 *         .then(()=>console.log('start 2'))
 *         .then(()=>delay(100))
 *         .then(()=>console.log('finish 2'))
 *
 * @param ms: milliseconds
 * @returns {Promise}
 */


const delay = ms => {
  let promiseCancel, promise = new Promise((resolve, reject) => {
    let timeoutId = setTimeout(resolve, ms);
    promiseCancel = () => {
      clearTimeout(timeoutId);
      reject(Error("Cancelled"));
    }
  });
  promise.cancel = () => { promiseCancel(); };
  return promise;
};

const d1000 = () => {
  return delay(1000).then(()=>true)
};




/* Tests: body */

const basscss = require('./_tasks/basscss')(gulp, $, taskCfg);


const test00 = gulp.series(basscss.clean, basscss.styles,
  () => printfiles('_build/css/base*')
);

const test01 = gulp.series(
  gulp.series(basscss.clean),
  gulp.series(basscss.styles),
  () => printfiles('_build/css/base*')
);

const test03 = gulp.series(
  gulp.series(basscss.clean, basscss.styles),
  () => printfiles('_build/css/base*')
);

const test_build = gulp.series(
  basscss.build,
  () => printfiles('_build/css/base*')
);

const test = gulp.series(test00, d1000, test01, d1000, test03, d1000, test_build);



const bootstrap = require('./_tasks/bootstrap')(gulp, $, taskCfg);
const BootstrapTests  = {
  build:
    gulp.series(
      bootstrap.build,
      () => printfiles('_build/css/bootstrap*')
    )
};



gulp.task('default', BootstrapTests.build);

exports.test = BootstrapTests.build;
