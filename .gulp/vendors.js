/**
 * Created by mao on 26.01.2017.
 */


/*  The Gulp Almighty */
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


/*  Debugging things */
const log = $.util.log;
const stringly = require('./helpers').stringly;
const logPipeline = require('./helpers').logPipeline;


/* Workflow things */
const del = require('del');
const zipHelper = require('./helpers').zipHelper;


/* Fetch and prepare configuration */
const c = require('../config.gulp.js');
const _basscss = c.sources.get('basscss');
const _bootstrap = c.sources.get('bootstrap');






const basscssCompile = () => {
  return gulp.src(_basscss.src.css)
    .pipe($.newer(_basscss.dest.css))

    .pipe($.if(c.run.sourcemaps, $.sourcemaps.init()))
    .pipe($.filenames('basscss:compile:source'))

    .pipe($.postcss(_basscss.postcss))

    .pipe($.if(c.run.sourcemaps, $.sourcemaps.write('.')))
    .pipe(gulp.dest(_basscss.dest.css))
    .pipe($.filenames('basscss:compile:dest'))

    .on('end', logPipeline('basscss', 'compile'));
};

const bootstrapCss = () => {
  return gulp.src(_bootstrap.src.sass)
    .pipe($.newer(_bootstrap.dest.css))

    .pipe($.filenames('bootstrap:css:source'))
    .pipe($.if(c.run.sourcemaps, $.sourcemaps.init()))

    .pipe($.sass(_bootstrap.options).on('error', $.sass.logError))
    .pipe($.postcss(_bootstrap.postcss))

    .pipe($.if(c.run.sourcemaps, $.sourcemaps.write('.')))
    .pipe(gulp.dest(_bootstrap.dest.css))
    .pipe($.filenames('bootstrap:css:dest'))

    .on('end', logPipeline('bootstrap', 'css'));
};

const bootstrapJs = () => {
  return gulp.src(_bootstrap.src.js)
/*  .pipe($.newer(_bootstrap.dest.js))*/

  .pipe($.filenames('bootstrap:js:source'))

  .pipe($.if(c.run.js.sourcemaps, $.sourcemaps.init()))
  .pipe(gulp.dest(_bootstrap.dest.js))
  .pipe($.rename('bootstrap.min.js'))
  .pipe($.if(c.run.uglify, $.uglify(c.plugins.uglify)))
  .pipe($.if(c.run.js.sourcemaps, $.sourcemaps.write('.')))

  .pipe(gulp.dest(_bootstrap.dest.js))
  .pipe($.filenames('bootstrap:js:dest'))

  .on('end', logPipeline('bootstrap', 'js'));
};

const basscssClean = () =>
        del(_basscss.src.clean)
        .then( paths => { console.log(paths.join('\n')) } );

const bootstrapClean = () =>
        del(_bootstrap.src.clean)
        .then( paths => { console.log(paths.join('\n')) } );


// gulp.task( 'basscss.clean', basscssClean );
gulp.task( 'basscss.compile', basscssCompile );
// gulp.task( 'basscss.build', basscssCompile );
gulp.task( 'basscss.clean.build',
        gulp.series( basscssClean, basscssCompile )
);


// gulp.task( 'bootstrap.clean', bootstrapClean );
gulp.task( 'bootstrap.compile',
        // gulp.series( bootstrapCss, bootstrapJs )
        gulp.parallel( bootstrapCss, bootstrapJs )
);
// gulp.task( 'bootstrap.build',
//         gulp.series( bootstrapCss, bootstrapJs )
// );
gulp.task( 'bootstrap.clean.build',
        gulp.series(
                bootstrapClean,
                // 'bootstrap.build'
                'bootstrap.compile'
        )
);

gulp.task( 'vendors.compile.css',
        gulp.parallel( basscssCompile, bootstrapCss ));
gulp.task( 'vendors.compile',
        gulp.parallel( 'basscss.compile', 'bootstrap.compile' ));
// gulp.task( 'vendors.build',
//         gulp.parallel( 'basscss.build', 'bootstrap.build' ));
gulp.task( 'vendors.clean',
         gulp.parallel( basscssClean, bootstrapClean ));
gulp.task( 'clean',
        gulp.parallel( basscssClean, bootstrapClean ));

exports.basscss = _basscss;
exports.bootstrap = _bootstrap;