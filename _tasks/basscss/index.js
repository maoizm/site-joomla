/**
 * Wraps tasks from current directory and allows using them in external module
 */

const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {

  let basscss = {

    styles:
      () => gulp.src(options.basscss.src)
      .pipe( run.sourcemaps.css
        ? plugins.sourcemaps.init()
        : plugins.noop()
      )
      .pipe( plugins.postcss(options.basscss.postcss) )
      .pipe( run.sourcemaps.css
        ? plugins.sourcemaps.write('./')
        : plugins.noop()
      )
      .pipe( gulp.dest(options.basscss.dest) )

  };

  basscss.styles.displayName = 'basscss.styles';

  return basscss;
};
