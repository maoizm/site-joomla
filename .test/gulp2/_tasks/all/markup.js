/**
 * Task name: all/markup
 */
const path = require('path');
const taskName = path.basename(__dirname)+'/'+path.basename(__filename, path.extname(__filename));

const run=require('../../cfg').run;

module.exports = (gulp, plugins, options={}) => {

/*  if (run.watch && options.watchFiles && !gulp.lastRun(taskName)) {
    gulp.watch(options.watchFiles,
      gulp.series( 'all/markup',
                   done => { options.browserSync.reload(); done(); }
      )
    );
  }*/

  return gulp.src(options.src)
         .pipe(gulp.dest(options.dest));

};