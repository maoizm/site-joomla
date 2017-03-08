/**
 * Wraps tasks from current directory and allows using them in external module
 */

const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {

  let bootstrap = {

    styles: () => gulp.src(options.bootstrap.styles.src)
        .pipe( plugins.if( run.sourcemaps.css,
                           plugins.sourcemaps.init() ))

        .pipe( plugins.sass(options.bootstrap.styles.sassOptions)
                      .on('error', plugins.sass.logError))

        .pipe( plugins.if( run.sourcemaps.css,
                           plugins.sourcemaps.write('./') ))

        .pipe( gulp.dest(options.bootstrap.styles.dest) ),

    scripts: () => gulp.src(options.bootstrap.scripts.src)
        .pipe( gulp.dest(options.bootstrap.scripts.dest) )

  };

  bootstrap.styles.displayName = 'bootstrap.styles';
  bootstrap.scripts.displayName = 'bootstrap.scripts';

  return bootstrap;

};

