/**
 * Wraps tasks from current directory and allows using them in external module
 */
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;

module.exports = (gulp, plugins, options={}) => {

  let template = {

    clean: () => del( options['template.clean'].src ),

    styles: () => gulp.src(options.template.styles.src)
        .pipe( plugins.using( {prefix:'styl-template1 :: ', color: 'green'} ))
        .pipe( plugins.sourcemaps.js.init() )
        .pipe( plugins.postcss(options.template.styles.postcss) )
        .pipe( plugins.if( run.postcssMinify,
                           plugins.postcss(options.template.styles.postcssMinify) ))
        .pipe( plugins.rename(run.postcssMinify ? 'styles.min.css' : 'styles.css') )
        .pipe( plugins.sourcemaps.js.write('./') )
        .pipe( gulp.dest(options.template.styles.dest) )
        .pipe( plugins.using( {prefix:'styl-template2 :: ', color: 'green'}) ),

    zip: () => gulp.src(options['template.zip'].src)
                  .pipe( plugins.zip(options['template.zip'].name) )
                  .pipe( gulp.dest(options['template.zip'].dest) )

  };

  template.styles.displayName = 'template.styles';
  template.clean.displayName = 'template.clean';
  template.zip.displayName = 'template.zip';

  return template;
};

