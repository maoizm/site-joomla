/**
 * Task name: all:markup:dist
 */


module.exports = (gulp, plugins, options={}) => {

/*  if (options.watchFiles && !gulp.lastRun('all:markup:dist')) {
      gulp.watch(options.watchFiles,
        gulp.series( 'all:markup',
                     done => { options.browserSync.reload(); done(); }
      ));
    }
*/


  return gulp.src(options.src)
          .pipe(plugins.htmlReplace({
            'css': 'css/styles.min.css'
          }))
          .pipe(gulp.dest(options.dest));

};