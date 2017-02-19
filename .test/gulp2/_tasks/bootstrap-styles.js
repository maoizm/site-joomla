/**
 * Task name: bootstrap:styles
 */

const production = require('../cfg').production;

module.exports = (gulp, plugins, options={}) => {

  if (options.watchFiles && !gulp.lastRun('bootstrap:styles')) {
    gulp.watch(options.watchFiles, gulp.series('bootstrap:styles'));
  }

  return gulp.src(options.src)
    .pipe(plugins.if(!production, plugins.sourcemaps.init()))
    .pipe(plugins.sass(options.sassOptions).on('error', plugins.sass.logError))
    .pipe(plugins.if(!production, plugins.sourcemaps.write('./')))    // produce map for non-minified css
    .pipe(gulp.dest(options.dest))
    .pipe(options.browserSync.reload({stream: true}));

};