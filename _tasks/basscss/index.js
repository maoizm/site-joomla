/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean: () => del(options['basscss.clean'].src),

      // variant 1:
      //   styles: () => require('./styles')(gulp, plugins, options[`${taskPrefix}/styles`])

      // varaint 2
      styles: function() {
        /* @TODO find solution to keep it here or move to main gulpfile.js

         if (run.watch && options.watchFiles && !gulp.lastRun(taskName)) {
         gulp.watch(options.watchFiles, gulp.series(taskName));
         }*/

        return gulp.src(options['basscss.styles'].src)
          .pipe(run.sourcemaps.css ? plugins.sourcemaps.init() : plugins.noop())
          .pipe(plugins.postcss(options['basscss.styles'].postcss))
          .pipe(run.sourcemaps.css ? plugins.sourcemaps.write('./') : plugins.noop() )    // produce map for non-minified css
          .pipe(gulp.dest(options['basscss.styles'].dest))
          .pipe(run.browserSync ? options['basscss.styles'].browserSync.reload({stream: true}) : plugins.noop());
      },

      zip: done => done()

  };

  result.build = gulp.series(result.clean, result.styles);
  return result;

};


