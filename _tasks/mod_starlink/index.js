/**
 * Wraps tasks from current directory and allows using them in external module
 */
const path = require('path');
const del = require('del');
const cfg = require('../../cfg');
const run = cfg.run;


module.exports = (gulp, plugins, options={}) => {
  let result = {

      clean: () => del( options['mod_starlink.clean'].src ),

      styles: done => done(),
      images: done => done(),
      markup: done => done(),
      other:  done => done(),
      scripts: done => done(),

      zip: () => gulp.src(options['mod_starlink.zip'].src)
          .pipe(plugins.zip(options['mod_starlink.zip'].name))
          .pipe(gulp.dest(options['mod_starlink.zip'].dest))

  };

  result.zip.displayName = 'mod_starlink.zip';
  result.build = gulp.series(
    result.clean,
    gulp.parallel(
      result.styles,
      result.scripts,
      result.markup,
      result.images,
      result.other
    ),
    result.zip
  );
  return result;

};


