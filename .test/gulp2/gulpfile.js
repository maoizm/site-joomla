/**
 * Created by mao on 02.02.2017.
 *
 * @TO+DO * default
 * @TO+DO     +develop
 *
 * @TO+DO * +develop
 * @TO+DO     +clean,
 * @TO+DO     +build,
 * @TO+DO     +serve
 *
 * @TO+DO * +clean
 * @TO+DO     +basscss/clean, +bootstrap/clean, +modules/clean, +template/clean
 *
 * @TO+DO * +build
 * @TO+DO     +styles, markup, scripts, images, other
 *
 * @TO+DO * +styles
 * @TO+DO     bootstrap/styles, basscss/styles
 * @TO+DO     +template/styles
 *
 * @TO+DO * scripts
 * @TO+DO     template/scripts, bootstrap/scripts
 *
 * @TO+DO * +build:dist
 * @TO+DO     +build
 * @TO+DO     styles:dist, scripts:dist, markup:dist
 * @TO+DO     images:dist, other:dist
 *
 * @TO+DO   basscss,
 * @TO+DO                +basscss/clean, basscss/styles
 *
 * @TO+DO   bootstrap,
 * @TO+DO                +bootstrap/clean, bootstrap/styles, bootstrap/scripts
 *
 * @TO+DO   template,
 * @TO+DO                +template/styles, template/scripts
 */


/*  The Gulp Almighty */
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


/*  Debugging things
 *  @TODO delete debug code      */
const { loggy, stringly } = require('../../.gulp/helpers');


/* Workflow things */
const del = require('del');


/* Fetch and prepare configuration */
const cfg = require('./cfg');
const run = cfg.run;
const taskCfg = cfg.task_config;
const browserSync = cfg.browserSync;




/* Main Workflow tasks */

  const basscss = require('./_tasks/basscss')(gulp, $, taskCfg);
  gulp.task('basscss::build', basscss.build);
  gulp.task('basscss::clean', basscss.clean);

  const bootstrap = require('./_tasks/bootstrap')(gulp, $, taskCfg);
  gulp.task('bootstrap::build', bootstrap.build);
  gulp.task('bootstrap::clean', bootstrap.clean);

  const template = require('./_tasks/template')(gulp, $, taskCfg);
  gulp.task('template::styles', template.styles);

  let scripts = gulp.parallel(
    template.scripts, bootstrap.scripts
  );



  gulp.task('styles::clean', () => del([ taskCfg['styles::clean'].src ]));


  let styles = gulp.series(
      gulp.parallel(
        bootstrap.styles, basscss.styles
      ),
      template.styles
  );

  let markup = () => {
    return gulp.src(taskCfg['markup'].src)
      .pipe(gulp.dest(taskCfg['markup'].dest))
      .pipe($.using());
  };

  let images = () => {
    return gulp.src(taskCfg['images'].src)
    .pipe(run.imagemin ? imagemin() : $.noop())
    .pipe(gulp.dest(taskCfg['images'].dest))
    .pipe($.using());
  };

  let other = () => {
    return gulp.src(taskCfg['other'].src)
    .pipe(gulp.dest(taskCfg['other'].dest))
    .pipe($.using());
  };


  let build = gulp.parallel(
      styles,
      markup,
      scripts,
      images,
      other
  );


  let develop = gulp.series(clean, build, serve);
  gulp.task('default', develop);



  /* Production (distribution) build */

  let buildDist = gulp.series(
      build,
      gulp.parallel( stylesDist, scriptsDist, markupDist, imagesDist, otherDist )
  );

  let dist = gulp.series(cleanDist, buildDist, serveDist);


  function stylesDist() {
    return gulp.src(taskCfg['styles::dist'].src)
    .pipe($.rename('styles.css'))
    .pipe($.postcss(taskCfg['styles::dist'].postcss))
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest(taskCfg['styles::dist'].dest))
  }


  function scriptsDist() {
    return gulp.src(taskCfg['scripts::dist'].src)
    .pipe($.concat('scripts.js'))
    .pipe($.uglify(taskCfg['scripts::dist'].postcss))
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest(taskCfg['scripts::dist'].dest))
  }


  function imagesDist() {
    return gulp.src(taskCfg['images::dist'].src)
    .pipe(gulp.dest(taskCfg['images::dist'].dest))
  }


  function markupDist() {
    return gulp.src(taskCfg['markup::dist'].src)
    .pipe($.htmlReplace({
      'css': 'css/styles.min.css',
      'js':  'js/scripts.min.js'
    }))
    .pipe(gulp.dest(taskCfg['markup::dist'].dest));
  }




/* Supplementary functions */

function serve() {

  browserSync.init({
    server:  {
      baseDir: '_build',
      directory: true,
    },
    browser: 'chrome',
    logLevel: 'debug',
    notify:  false
  });
  cfg.run.browserSync = true;

  gulp.watch(taskCfg['markup'].watchFiles)
    .on('change',
      gulp.series(markup, browserSync.reload)
    );

  gulp.watch([taskCfg['basscss/styles'].watchFiles])
    .on('change',
      gulp.series(basscss.styles, browserSync.reload)
    );

  gulp.watch([taskCfg['bootstrap/styles'].watchFiles])
    .on('change',
      gulp.series(bootstrap.styles, browserSync.reload)
    );

  gulp.watch([taskCfg['template/styles'].watchFiles])
    .on('change',
      gulp.series(template.styles, browserSync.reload)
    );

}


function serveDist() {
  browserSync.init({
    server:  {
      baseDir: '_dist',
      directory: true,
    },
    browser: 'chrome'
  });
}


function otherDist() {
  return gulp.src(taskCfg['other::dist'].src)
  .pipe(gulp.dest(taskCfg['other::dist'].dest))
};


function cleanDist() {
  return del([cfg.paths.dist]);
}


function clean() {
  return del([cfg.paths.build]);
}


exports.clean = clean;
exports.serve = serve;
exports.styles = styles;
exports.scripts = scripts;
exports.develop = develop;
exports.build = build;
exports.dist = dist;