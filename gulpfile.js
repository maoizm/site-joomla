/**
 * Main gulp file for building application
 *
 */



/* @TO+DO env.debug -> pipe everything through gulp-using();
 */




/*  The Gulp Almighty */
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const sourcemaps = $.sourcemaps;
const uglify = $.uglify;
const noop = $.noop;
const using = $.using;
const imagemin = $.imagemin;
const gulpif = $.if;




/*  Debugging things */




/* Fetch and prepare configuration */
const cfg = require('./cfg');
const run = cfg.run;




/* Main Workflow tasks */
const browserSync = require('browser-sync').create();
cfg.browserSync = browserSync;
const del = require('del');
const merge = require('merge-stream');


const modules = [
  'basscss',
  'bootstrap',
  //'mod_calc', //'mod_map', //'mod_services', //'mod_starlink',
  'template'
].map( e => require(`./_tasks/${e}`)(gulp, $, cfg.tasks) );


const [
  basscss,
  bootstrap,
  //mod_calc, //mod_map, //mod_services, //mod_starlink,
  template
] = modules;


const compile = {

  images: () =>
            gulp.src( cfg.tasks.images.src )
            .pipe( gulpif( run.imagemin,
              imagemin(cfg.tasks.images.imagemin) ))
            .pipe( gulpif( cfg.options.debug,
              using({prefix:'imgs :: ', color: 'magenta'}) ))
            .pipe( gulp.dest(cfg.tasks.images.dest) ),

  styles:
    gulp.series(
      gulp.parallel(
        bootstrap.styles,
        basscss.styles
      ),
      template.styles
    ),

  scripts: () => {
    let stream1 = gulp.src(cfg.tasks.scripts.src)
      .pipe(gulpif(cfg.options.debug,
        using({prefix: 'scrp :: ', color: 'yellow'})))
      .pipe(gulpif(run.sourcemaps.js,
        sourcemaps.init(cfg.tasks.scripts.sourcemaps)))
      .pipe($.concat('scripts.js'))
      .pipe(gulpif(run.uglify,
        uglify()))
      .pipe(gulpif(run.uglify,
        $.rename({extname: '.min.js'})))
      .pipe(gulpif(run.sourcemaps.js,
        sourcemaps.write('./')))
      .pipe(gulp.dest(cfg.tasks.scripts.dest))
      .pipe(gulpif(cfg.options.debug,
        using({prefix: 'scrp :::::::> ', color: 'yellow'})));

    let stream2 = gulp.src(cfg.tasks.scripts.srcNoConcat)
      .pipe(gulp.dest(cfg.tasks.scripts.dest + '/jui'))

    return(merge(stream1, stream2));
  }             ,

  markup: () => {
    const JsMinified = file => file.basename==='logic.php' && run.uglify;
    const CssMinified = file => file.basename==='logic.php' && run.postcssMinify;

    return gulp.src( cfg.tasks.markup.src )
    .pipe( gulpif( JsMinified,
      $.replace( /scripts\.js/gi, 'scripts.min.js' )))
    .pipe( gulpif( CssMinified,
      $.replace( /styles\.css/gi, 'styles.min.css' )))
    .pipe( gulpif( cfg.options.debug,
      using({prefix:'mrkp :: ', color: 'cyan'})))
    .pipe( gulp.dest(cfg.tasks.markup.dest) );

  },

  other: () =>
           gulp.src( cfg.tasks.other.src )
           .pipe( gulp.dest(cfg.tasks.other.dest) )
           .pipe( gulpif( cfg.options.debug,
             using( {prefix:'othr :: ', color: 'grey'} )))

};


const develop = gulp.series(
  clean,
  build,
  deploy,
  serve
);


const produce = gulp.series(
  clean,
  build,
  gulp.parallel( deploy, zip )
);


function clean() {
  return del( [cfg.paths.build, ...cfg.tasks.clean.dist.src], { force: true } );
}


function build(done) {
  gulp.parallel(
    compile.images,
    compile.styles,
    compile.scripts,
    compile.markup,
    compile.other
  )(done)
}


function serve() {

  browserSync.init({
    proxy: 'http://joomla.dev',
    //browser: 'chrome', logLevel: 'debug',
    notify:  false
  });

  {
    const logChange = (path, stat) => console.log(`File ${path} was changed`);
    cfg.run.browserSync = true;

    let markupWatcher = gulp.watch(cfg.tasks.markup.watchFiles,
      gulp.series(
        compile.markup,
        deploy,
        (done) => {
          browserSync.reload();
          done();
        }
      ));
    markupWatcher.on('change', logChange);

    let stylesWatcher = gulp.watch(cfg.tasks.template.styles.watchFiles,
      gulp.series(
        compile.styles,
        deploy,
        (done) => {
          browserSync.reload();
          done();
        }
      )
    );
    stylesWatcher.on('change', logChange);

    let scriptsWatcher = gulp.watch(cfg.tasks.scripts.watchFiles,
      gulp.series(
        compile.scripts,
        deploy,
        (done) => {
          browserSync.reload();
          done();
        }
      ));
    scriptsWatcher.on('change', logChange);
  }

}


function zip(done) {

  gulp.series(
    zipModules,
    zipPackage,
    deleteTempFiles
  )(done);


  function zipModules() {

    let s1 = [
      'mod_starlink',
      'mod_starlink_calculator_outsourcing',
      'mod_starlink_map',
      'mod_starlink_services'
    ].map(e => gulp.src(`${cfg.paths.dist}/${e}/**/*`)
    .pipe($.zip(`${e}.zip`))
    .pipe(gulp.dest(cfg.paths.dist))
    );

    let s2 = gulp.src(`${cfg.paths.dist}/templates/starlink/**/*`)
    .pipe($.zip('tpl_starlink.zip'))
    .pipe(gulp.dest(cfg.paths.dist));

    let s3 = gulp.src(`${cfg.paths.dist}/libraries*/**/*`)
    .pipe($.zip('libraries.zip'))
    .pipe(gulp.dest(cfg.paths.dist));

    return merge(s1, s2, s3);
  }

  function zipPackage() {
    return gulp.src([
      `${cfg.paths.dist}/mod_*.zip`,
      `${cfg.paths.dist}/tpl_starlink.zip*`,
      `${cfg.paths.dist}/pkg_*.xml`
    ])
    .pipe(cfg.options.debug
      ? using({prefix: 'zip  :  ', color: 'red'})
      : noop()
    )
    .pipe($.zip('pkg_starlink.zip'))
    .pipe(gulp.src(`${cfg.paths.dist}/libraries.zip`, {passthrough: true}))
    .pipe(cfg.options.debug
      ? using({prefix: 'zip  :: ', color: 'red'})
      : noop()
    )
    .pipe(gulp.dest(cfg.paths.zip))
    .pipe(cfg.options.debug
      ? using({prefix: 'zip  ::::::::> ', color: 'red'})
      : noop()
    );
  }

  function deleteTempFiles() {
    return del(['_dist/*.zip', '_dist/pkg_starlink.xml']);
  }

}


function deploy(done) {

  gulp.series(
    deployClean,
    gulp.parallel(
      deployModules,
      deployTemplates
    )
  )(done);

  function deployClean() {
    return del([
        `${cfg.paths.deploy}/modules/mod_starlink*/**`,
        `${cfg.paths.deploy}/templates/starlink/**`,
        `${cfg.paths.deploy}/media/mod_starlink*/**`
      ],
      {force: true}
    );
  }

  function deployModules() {

    let mods = {
      LibraryPatch:
        gulp.src(`${cfg.paths.dist}/libraries/**`)
        .pipe(gulp.dest(`${cfg.paths.deploy}/libraries`)),

      ModuleMarkup:
        gulp.src([
          `${cfg.paths.dist}/mod_*/**`,
          `!${cfg.paths.dist}/mod_*/{fonts,images}*/**`
        ])
        .pipe(gulp.dest(`${cfg.paths.deploy}/modules`)),

      ModuleAssets:
        gulp.src(`${cfg.paths.dist}/mod_*/{fonts,images}*/**`)
        .pipe(gulp.dest(`${cfg.paths.deploy}/media`))
    };

    return merge(
      mods.LibraryPatch,
      mods.ModuleMarkup,
      mods.ModuleAssets
    );
  }

  function deployTemplates () {
    return gulp.src(`${cfg.paths.dist}/templates/**`)
    .pipe(gulp.dest(`${cfg.paths.deploy}/templates`))
    .pipe(gulpif(cfg.options.debug,
      using({prefix: 'dply :::::::> ', color: 'white'})));
  }

}


gulp.task('default', develop);

exports.clean = clean;
exports.serve = serve;
exports.develop = develop;
exports.produce = produce;
exports.zip = zip;