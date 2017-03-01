/**
 * Wraps tasks from current directory and allows using them in external module
 */
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;

module.exports = (gulp, plugins, options={}) => ({

      clean: () => del( options['template.clean'].src ),

      styles: () => gulp.src(options.template.styles.src)
          .pipe( run.sourcemaps.css
                  ? plugins.sourcemaps.init()
                  : plugins.noop()
          )
          .pipe( plugins.postcss(options.template.styles.postcss) )
          .pipe( run.postcssMinify
                  ? plugins.postcss(options.template.styles.postcssMinify)
                  : plugins.noop()
          )
          .pipe( plugins.rename(run.postcssMinify
                  ? 'styles.min.css'
                  : 'styles.css')
          )
          .pipe(run.sourcemaps.css
                  ? plugins.sourcemaps.write('./')
                  : plugins.noop()
          )
          .pipe(cfg.options.debug
                  ? plugins.using({prefix:'styl :: ', color: 'green'})
                  : plugins.noop()
          )
          .pipe( gulp.dest(options.template.styles.dest) )

          .pipe( run.browserSync
                  ? cfg.browserSync.reload( {stream: true} )
                  : plugins.noop()
          ),


      zip: () => gulp.src(options['template.zip'].src)
                  .pipe(plugins.zip(options['template.zip'].name))
                  .pipe(gulp.dest(options['template.zip'].dest))

});


