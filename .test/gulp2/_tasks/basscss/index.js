/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const taskPrefix = path.basename(__dirname);
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;

function styles2(gulp, plugins, options){
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
}


function clean() {
  return del(cfg.task_config['basscss/clean'].src);
}

module.exports = (gulp, plugins, options={}) => ({
  clean,
  clean2: clean,
  cleannew: function(){
    return del(options[`${taskPrefix}/clean`].src)
  },
  styles: () => require('./styles')(gulp, plugins, options[`${taskPrefix}/styles`]),
  stylesnew: () => styles2(gulp, plugins, options[`${taskPrefix}/styles`])
  //styles: () => basscss__styles()
});
