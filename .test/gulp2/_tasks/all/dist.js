/**
 * Task name: all/dist
 */
const path = require('path');
const taskName = path.basename(__dirname)+'/'+path.basename(__filename, path.extname(__filename));

const run=require('../../cfg').run;

module.exports = (gulp, plugins, options={}) => {
  let $ = plugins;

  if (run.watch && options.watchFiles && !gulp.lastRun('all/dist')) {
    gulp.watch(options.watchFiles,
      gulp.series(
        'all/dist' ,
        done => {
          options.browserSync.reload();
          done();
        }
      )
    );
  }

  return gulp.src(options.src)
    .pipe($.postcss(options.postcss))
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest(options.dest));

};