/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean: () => del( options['bootstrap.clean'].src ),

      styles: () => gulp.src(options['bootstrap.styles'].src)
            .pipe(run.sourcemaps.css ? plugins.sourcemaps.init() : plugins.noop())
            .pipe(plugins.sass(options['bootstrap.styles'].sassOptions).on('error', plugins.sass.logError))
            .pipe(run.sourcemaps.css ? plugins.sourcemaps.write('./') : plugins.noop())    
            .pipe(gulp.dest(options['bootstrap.styles'].dest))
            .pipe(run.browserSync ? options['bootstrap.styles'].browserSync.reload({stream: true}) : plugins.noop()),

      scripts: () => gulp.src(options['bootstrap.scripts'].src)
            .pipe(gulp.dest(options['bootstrap.scripts'].dest)),

      zip: done => done()

  };

  result.build = gulp.series(
    result.clean,
    gulp.parallel(
      result.styles,
      result.scripts
    )
  );
  return result;

};


