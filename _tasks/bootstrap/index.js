/**
 * Wraps tasks from current directory and allows using them in external module
 */

const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => ({

      styles: () => gulp.src(options.bootstrap.styles.src)
            .pipe(run.sourcemaps.css
                    ? plugins.sourcemaps.init()
                    : plugins.noop()
            )
            .pipe( plugins.sass(options.bootstrap.styles.sassOptions)
                              .on('error', plugins.sass.logError)
            )
            .pipe( run.sourcemaps.css
                    ? plugins.sourcemaps.write('./')
                    : plugins.noop()
            )
            .pipe( gulp.dest(options.bootstrap.styles.dest) ),

      scripts: () => gulp.src(options.bootstrap.scripts.src)
            .pipe(gulp.dest(options.bootstrap.scripts.dest))

});

