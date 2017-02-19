/**
 * Task name: all:styles:dist
 */


module.exports = (gulp, plugins, options={}) => {

  if (options.watchFiles && !gulp.lastRun('all:styles:dist')) {
    gulp.watch(options.watchFiles,
      gulp.series(
        'all:styles:dist' ,
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