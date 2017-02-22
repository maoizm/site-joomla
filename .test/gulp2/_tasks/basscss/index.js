/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const taskPrefix = path.basename(__dirname);
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;

function styles2(gulp, plugins, options) {
  let $ = plugins;

/*  if (run.watch && options.watchFiles && !gulp.lastRun(taskName)) {
    gulp.watch(options.watchFiles, gulp.series(taskName));
  }*/

  return gulp.src(options.src)
  .pipe(run.sourcemaps.css ? $.sourcemaps.init() : $.noop())
  .pipe($.postcss(options.postcss))
  .pipe(run.sourcemaps.css ? $.sourcemaps.write('./') : $.noop() )    // produce map for non-minified css
  .pipe(gulp.dest(options.dest))
  .pipe(run.browserSync ? options.browserSync.reload({stream: true}) : $.noop());
}



module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean: function(){
        return del( options[`basscss/clean`].src )
      },

      // variant 1:
      //   styles: () => require('./styles')(gulp, plugins, options[`${taskPrefix}/styles`])

      // varaint 2
      styles: function() {
        let $ = plugins;
        let localOptions = options['basscss/styles'];

        /* @TODO find solution to keep it here or move to main gulpfile.js

         if (run.watch && options.watchFiles && !gulp.lastRun(taskName)) {
         gulp.watch(options.watchFiles, gulp.series(taskName));
         }*/

        return gulp.src(localOptions.src)
          .pipe(run.sourcemaps.css ? $.sourcemaps.init() : $.noop())
          .pipe($.postcss(localOptions.postcss))
          .pipe(run.sourcemaps.css ? $.sourcemaps.write('./') : $.noop() )    // produce map for non-minified css
          .pipe(gulp.dest(localOptions.dest))
          .pipe(run.browserSync ? localOptions.browserSync.reload({stream: true}) : $.noop());
      }

  };

  result.build = gulp.series(result.clean, result.styles);
  return result;

};


