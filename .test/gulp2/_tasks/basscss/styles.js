/**
 * Task name: basscss/styles
 */

const path = require('path');
const taskName = path.basename(__dirname)+'/'+path.basename(__filename, path.extname(__filename));

const run=require('../../cfg').run;


module.exports = (gulp, plugins, options={}) => {
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
};