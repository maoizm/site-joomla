/**
 * Task name: all/styles-dist
 */
const path = require('path');
const taskName = path.basename(__dirname)+'/'+path.basename(__filename, path.extname(__filename));

const run=require('../../cfg').run;

module.exports = (gulp, plugins, options={}) => {

  if (run.watch && options.watchFiles && !gulp.lastRun('all/styles-dist')) {
    gulp.watch(options.watchFiles,
      gulp.series(
        'all/styles:dist' ,
        done => {
          options.browserSync.reload();
          done();
        }
      )
    );
  }

  return gulp.src(options.src)
    .pipe(plugins.postcss(options.postcss))
    .pipe(plugins.rename({extname: '.min.css'}))
    .pipe(gulp.dest(options.dest));

};