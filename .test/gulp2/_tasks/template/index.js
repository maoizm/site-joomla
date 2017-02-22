/**
 * Wraps tasks from current directory and allows using them in external module
 */
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean: function(){
        return del( options[`template/clean`].src )
      },

      styles: function() {
        let $ = plugins;
        let localOptions = options['template/styles'];


        return gulp.src(localOptions.src)
          .pipe(run.sourcemaps.css ? $.sourcemaps.init() : $.noop())
          .pipe($.postcss(localOptions.postcss))
          .pipe($.rename({extname: '.css'}))
          .pipe(run.sourcemaps.css ? $.sourcemaps.write('./') : $.noop())    // produce map for non-minified css
          .pipe(gulp.dest(localOptions.dest))
          .pipe(run.browserSync ? localOptions.browserSync.reload({stream: true}): $.noop());

      },

      scripts: function() {
        let localOptions = options['template/scripts'];

        return gulp.src(localOptions.src)
          .pipe(gulp.dest(localOptions.dest));
      }

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


