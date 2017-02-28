/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {

  let result = {

      clean: () => del( options[`mod_calc/clean`].src ),

      styles: () => gulp.src(options['mod_calc.styles'].src)
            .pipe(run.sourcemaps.css ? plugins.sourcemaps.init() : plugins.noop())
            .pipe(plugins.postcss(options.postcss))
            .pipe(plugins.rename({extname: '.css'}))
            .pipe(run.sourcemaps.css ? plugins.sourcemaps.write('./') : plugins.noop())    // produce map for non-minified css
            .pipe(gulp.dest(options['mod_calc.styles'].dest))
            .pipe(run.browserSync ? options['mod_calc.styles'].browserSync.reload({stream: true}) : plugins.noop()),

      images: done => done(),
      markup: done => done(),
      other:  done => done(),
      scripts: () => gulp.src(options['mod_calc.scripts'].src)
                     .pipe(gulp.dest(options['mod_calc.scripts'].dest)),

      zip: () => gulp.src(options['mod_calc.zip'].src)
            .pipe(plugins.zip(options['mod_calc.zip'].name))
            .pipe(gulp.dest(options['mod_calc.zip'].dest))

  };

  result.build = gulp.series(
    result.clean,
    gulp.parallel(
      result.styles,
      result.scripts,
      result.markup,
      result.images,
      result.other
    ),
    result.zip
  );
  return result;

};


