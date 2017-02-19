/**
 * Created by mao on 02.02.2017.
 */


/*  The Gulp Almighty */
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


/*  Debugging things
 *  @TODO delete debug code      */
const loggy = require('../../.gulp/helpers').loggy;
const stringly = require('../../.gulp/helpers').stringly;


/* Workflow things */
const del = require('del');


/* Fetch and prepare configuration */
let cfg = require('./cfg');
const taskCfg = cfg.task_config;
const browserSync = cfg.browserSync;



/* Task execution engine */

/**
 * Get a task. This function just gets a task from the tasks directory.
 *
 * @param {string} name The name of the task.
 * @returns {function} The task!
 *
 * Task example:
 *
 *   sometask.js:
 *   ------------
 *
 *        module.exports = (gulp, plugins, options) =>
 *          gulp.src(options.src)
 *          .pipe(plugins.if(options.minify, plugins.cssnano()))
 *          .gulp.dest(options.dest)
 *
 *   options = {
 *     src: [ '/some/path', 'some/path2' ],
 *     dest:  '/path3',
 *     ...
 *     other options
 *     ...
 *   };
 *
 */

function getTask(name) {
 return require(`./_tasks/${name.split(':').join('-')}`)(gulp, $, taskCfg[name] || {});
}


/* Main Workflow tasks */
{
  {

    // gulp.task('bootstrap:clean', () => getTask('bootstrap:clean'));
    // gulp.task('basscss:clean', () => getTask('basscss:clean'));
    // gulp.task('mod_starlink:clean', () => getTask('mod_starlink:clean'));

    gulp.task('bootstrap:styles', () => getTask('bootstrap:styles'));
    gulp.task('basscss:styles', () => getTask('basscss:styles'));
    gulp.task('mod_starlink:styles', () => getTask('mod_starlink:styles'));

    gulp.task('all:markup', () => getTask('all:markup'));
    gulp.task('all:markup:dist', () => getTask('all:markup:dist'));

    gulp.task('all:styles:dist', () => getTask('all:styles:dist'));

  }


  gulp.task('all:styles',
    gulp.series(
      gulp.parallel(
        'bootstrap:styles',
        'basscss:styles'
      ),
      gulp.series('mod_starlink:styles')
    )
  );

  gulp.task('build:dev',
    gulp.parallel(
      'all:styles',
      'all:markup'
    )
  );

  gulp.task('build:dist',
    gulp.series(
      'build:dev',
      gulp.parallel( 'all:styles:dist', 'all:markup:dist' )
    )
  );


  gulp.task('develop', gulp.series(cleanBuild, 'build:dev', serveDev));

  gulp.task('dist', gulp.series(cleanDist, 'build:dist', serveDist));

  gulp.task('default', gulp.series('develop'));

}



/* Supplementary functions */


  function serveDev() {

    browserSync.init({
      server:  {baseDir: '_build'},
      browser: 'chrome',
      notify:  false
    });

    gulp.watch(taskCfg['all:markup'].src)
    .on('change',
      gulp.series('all:markup', browserSync.reload)
    );

  }


  function serveDist() {

    browserSync.init({
      server:  {baseDir: '_dist'},
      browser: 'chrome'
    });

  }


  function cleanDist() {
    return del([cfg.paths.dist]);
  }

  function cleanBuild() {
    return del([cfg.paths.build]);
  }





/* Test and debug functions */

  function all_markup(target) {
    function getTask() {
      return require('./_tasks/all-markup')(gulp, $, taskCfg['all::markup'](target) || {});
    }

    return function() { return getTask(); }
  };


  gulp.task('test:functions', all_markup('dist') );




