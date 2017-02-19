/**
 * Task name: basscss:styles
 */

const production = require('../cfg').production;

module.exports = (gulp, plugins, options={}) => {

  if (options.watchFiles && !gulp.lastRun('basscss:styles')) {
    gulp.watch(options.watchFiles, gulp.series('basscss:styles'));
  }

  return gulp.src(options.src)
    .pipe(plugins.if(!production, plugins.sourcemaps.init()))
    .pipe(plugins.postcss(options.postcss))
    .pipe(plugins.if(!production, plugins.sourcemaps.write('./')))    // produce map for non-minified css
    .pipe(gulp.dest(options.dest))
    .pipe(options.browserSync.reload({stream: true}));

};