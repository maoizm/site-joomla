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
      .pipe( plugins.sourcemaps.css.init() )
      .pipe( plugins.postcss(options.basscss.postcss) )
      .pipe( plugins.sourcemaps.css.write('./') )
      .pipe( gulp.dest(options.basscss.dest) )

  };

  basscss.styles.displayName = 'basscss.styles';

  return basscss;
};
