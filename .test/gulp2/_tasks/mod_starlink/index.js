/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean:

        function() {
          return del( options[`mod_starlink/clean`].src )
        },

      styles:

        function() {
          let $ = plugins;
          let localOptions = options['mod_calc/styles'];

          return gulp.src(localOptions.src)
            .pipe(run.sourcemaps.css ? $.sourcemaps.init() : $.noop())
            .pipe($.postcss(options.postcss))
            .pipe($.rename({extname: '.css'}))
            .pipe(run.sourcemaps.css ? $.sourcemaps.write('./') : $.noop())    // produce map for non-minified css
            .pipe(gulp.dest(localOptions.dest))
            .pipe(run.browserSync ? localOptions.browserSync.reload({stream: true}) : $.noop());
        }

  };

  result.build = gulp.series(
    result.clean,
    result.styles,
  );
  return result;

};


