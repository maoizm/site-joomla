/**
 * Wraps tasks from current directory and allows using them in external module
 */
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean: () => del( options['template.clean'].src ),

      styles: () => gulp.src(options['template.styles'].src)
          .pipe(run.sourcemaps.css ? plugins.sourcemaps.init() : plugins.noop())
          .pipe(plugins.postcss(options['template.styles'].postcss))
          .pipe(plugins.rename({extname: '.css'}))
          .pipe(run.sourcemaps.css ? plugins.sourcemaps.write('./') : plugins.noop())    // produce map for non-minified css
          .pipe(gulp.dest(options['template.styles'].dest))
          .pipe(run.browserSync ? options['template.styles'].browserSync.reload({stream: true}): plugins.noop()),


      scripts: () => gulp.src(options['template.scripts'].src)
          .pipe(gulp.dest(options['template.scripts'].dest)),

      images: done => done(),
      markup: done => done(),
      other:  done => done(),
      scripts: done => done(),

      zip: () => gulp.src(options['template.zip'].src)
                  .pipe(plugins.zip(options['template.zip'].name))
                  .pipe(gulp.dest(options['template.zip'].dest))

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


