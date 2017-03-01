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
  'mod_calc',
  'mod_map',
  'mod_services',
  'mod_starlink',
  'template'
].map( e => require(`./_tasks/${e}`)(gulp, $, cfg.tasks) );


const [
  basscss,
  bootstrap,
  mod_calc,
  mod_map,
  mod_services,
  mod_starlink,
  template
] = modules;


let images = () =>
  gulp.src( cfg.tasks.images.src )
    .pipe( gulpif( run.imagemin,
              imagemin(cfg.tasks.images.imagemin)))
    .pipe( gulpif( cfg.options.debug,
              using({prefix:'imgs :: ', color: 'magenta'})))
    .pipe( gulp.dest(cfg.tasks.images.dest) );


let styles = (done) =>
  gulp.series(
    gulp.parallel(
      bootstrap.styles,
      basscss.styles
    ),
    template.styles
  )(done);


let scripts = () =>
  gulp.src( cfg.tasks.scripts.src )
        .pipe( gulpif( cfg.options.debug,
          using({prefix:'scrp :: ', color: 'yellow'})))
    .pipe( gulpif( run.sourcemaps.js,
              sourcemaps.init(cfg.tasks.scripts.sourcemaps))
    )
    .pipe( $.concat('scripts.js') )
    .pipe( gulpif( run.uglify,
              uglify())
    )
    .pipe( gulpif( run.uglify,
              $.rename({extname: '.min.js'}))
    )
    .pipe( gulp.src(cfg.tasks.scripts.srcNoConcat, {passthrough: true}) )
    .pipe( gulpif( run.sourcemaps.js,
              sourcemaps.write('./'))
    )
    .pipe( gulp.dest(cfg.tasks.scripts.dest) )
    .pipe( gulpif( cfg.options.debug,
              using({prefix:'scrp :::::::> ', color: 'yellow'}))
    );


let other = () =>
  gulp.src( cfg.tasks.other.src )
    .pipe( gulp.dest(cfg.tasks.other.dest) )
    .pipe( gulpif( cfg.options.debug,
              using( {prefix:'othr :: ', color: 'grey'} )));


let markup = () => {
  const JsMinified = file => file.basename==='logic.php' && run.uglify;
  const CssMinified = file => file.basename==='logic.php' && run.postcssMinify;

  return gulp.src( cfg.tasks.markup.src )
    .pipe( gulpif( JsMinified,
              $.replace( /scripts\.js/gi, 'scripts.min.js' )))
    .pipe( gulpif( CssMinified,
              $.replace( /styles\.css/gi, 'styles.min.css' )))
    .pipe( gulpif( cfg.options.debug,
              using({prefix:'mrkp :: ', color: 'cyan'})))
    .pipe( gulp.dest(cfg.tasks.markup.dest) )
    .pipe( gulpif( cfg.run.browserSync,
              browserSync.reload({stream: true})));
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
      images,
      styles,
      scripts,
      markup,
      other
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

    let markupWatcher = gulp.watch(cfg.tasks.markup.watchFiles, gulp.series(markup, deploy));
    //markupWatcher.on('change', logChange);

    let stylesWatcher = gulp.watch(cfg.tasks.template.styles.watchFiles, gulp.series(styles, deploy));
    //stylesWatcher.on('change', logChange);

    let scriptsWatcher = gulp.watch(cfg.tasks.scripts.watchFiles, gulp.series(scripts, deploy));
    //scriptsWatcher.on('change', logChange);
  }

}


function zip(done) {
  let zipPackage, deleteTempFiles;

  {
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

      zipPackage = () => gulp.src([
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

      deleteTempFiles = () => del(['_dist/*.zip', '_dist/pkg_starlink.xml']);
  }

  gulp.series(
    zipModules,
    zipPackage,
    deleteTempFiles
  )(done);
}


function deploy(done) {

  gulp.series(
    () => del([
                `${cfg.paths.deploy}/modules/mod_starlink*/**`,
                `${cfg.paths.deploy}/templates/starlink/**`,
                `${cfg.paths.deploy}/media/mod_starlink*/**`
              ], {force: true}
    ),
    gulp.parallel(
      () => gulp.src( `${cfg.paths.dist}/libraries/**` )
            .pipe(gulp.dest( `${cfg.paths.deploy}/libraries` )),
      () => gulp.src( [
              `${cfg.paths.dist}/mod_*/**`,
              `!${cfg.paths.dist}/mod_*/fonts*/**`,
              `!${cfg.paths.dist}/mod_*/images*/**`
            ])
            .pipe(gulp.dest( `${cfg.paths.deploy}/modules` )),
      () => gulp.src( `${cfg.paths.dist}/mod_*/{fonts,images}/**` )
            .pipe(gulp.dest(`${cfg.paths.deploy}/media`)),
      () => gulp.src( `${cfg.paths.dist}/templates/**` )
            .pipe(gulp.dest( `${cfg.paths.deploy}/templates` ))
                .pipe( gulpif( cfg.options.debug,
                  using({prefix:'dply :::::::> ', color: 'white'})))
    ),
    () =>   gulp.src( `${cfg.paths.deploy}/templates/starlink/templateDetails.xml` )
            .pipe(gulp.dest( `${cfg.paths.deploy}/templates/starlink` ))
            .pipe( gulpif( cfg.run.browserSync,
                browserSync.reload({stream: true})))
  )(done)
}


gulp.task('default', develop);

exports.clean = clean;
exports.serve = serve;
exports.develop = develop;
exports.produce = produce;
exports.zip = zip;