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
const cfg = require('./cfg');
const run = cfg.run;

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

/*function getTask(name) {
 return require(`./_tasks/${name.split(':').join('-')}`)(gulp, $, taskCfg[name] || {});
}*/

function getTask(name) {
  return require(`./_tasks/${name}`)(gulp, $, taskCfg[name] || {});
}


/* Main Workflow tasks */
{

  gulp.task('bootstrap/styles', () => getTask('bootstrap/styles'));
  gulp.task('basscss/styles', () => getTask('basscss/styles'));
  gulp.task('template/styles', () => getTask('template/styles'));


  gulp.task('all/styles-clean', () => del([ taskCfg['all/styles-clean'].src ]));

  gulp.task('template/scripts',
    () => gulp.src(taskCfg['template/scripts'].src)
    .pipe(gulp.dest(taskCfg['template/scripts'].dest))
  );

  gulp.task('bootstrap/scripts',
    () => gulp.src(taskCfg['bootstrap/scripts'].src)
    .pipe(gulp.dest(taskCfg['bootstrap/scripts'].dest))
  );


  gulp.task('all/styles',
    gulp.series(
      gulp.parallel( 'bootstrap/styles', 'basscss/styles' ),
      gulp.series('template/styles')
    )
  );

  gulp.task('all/scripts',
    gulp.parallel( 'template/scripts', 'bootstrap/scripts' )
  );

  gulp.task('all/markup', () => getTask('all/markup'));

  gulp.task('all/images', () =>
    gulp.src(taskCfg['all/images'].src)
      .pipe(run.imagemin ? imagemin() : $.noop())
      .pipe(gulp.dest(taskCfg['all/images'].dest))
  );

  gulp.task('all/other',
    () => gulp.src(taskCfg['all/other'].src)
    .pipe(gulp.dest(taskCfg['all/other'].dest))
  );

  gulp.task('all/clean', cleanBuild );



  gulp.task('build/dev',
    gulp.parallel(
      'all/styles',
      'all/markup',
      'all/scripts',
      'all/images',
      'all/other'
    )
  );

  gulp.task('develop', gulp.series(cleanBuild, 'build/dev', serveDev));
  gulp.task('default', gulp.series('develop'));


  gulp.task('all/dist', () => getTask('all/dist'));
  gulp.task('all/markup-dist', () => getTask('all/markup-dist'));
  gulp.task('all/styles-dist', () => getTask('all/styles-dist'));

  gulp.task('build:dist',
    gulp.series(
      'build/dev',
      gulp.parallel( 'all/styles-dist', 'all/markup-dist' )
    )
  );

  gulp.task('dist', gulp.series(cleanDist, 'build:dist', serveDist));


}



/* Supplementary functions */


  function serveDev() {

    browserSync.init({
      server:  {baseDir: '_build'},
      browser: 'chrome',
      notify:  false
    });
    cfg.run.browserSync = true;

    gulp.watch(taskCfg['all/markup'].src)
    .on('change',
      gulp.series('all/markup', browserSync.reload)
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





