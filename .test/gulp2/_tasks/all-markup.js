/**
 * Task name: all:markup
 */


module.exports = (gulp, plugins, options={}) => {

  if (options.watchFiles && !gulp.lastRun('all:markup')) {
    gulp.watch(options.watchFiles,
      gulp.series( 'all:markup',
                   done => { options.browserSync.reload(); done(); }
      )
    );
  }

  return gulp.src(options.src)
         .pipe(gulp.dest(options.dest));

};