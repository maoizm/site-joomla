/**
 * Wraps tasks from current directory and allows using them in external module
 */

const del = require('del');
const cfg = require('../../cfg');


module.exports = (gulp, plugins, options={}) => {

  let modcalc = {

      clean: () => del( options.modcalc.clean.src ),

      styles: () => gulp.src(options.modcalc.styles.src)
          .pipe( plugins.sourcemaps.css.init() )
          .pipe( plugins.postcss(options.modcalc.styles.postcss) )
          .pipe( plugins.rename({extname: '.css'}) )
          .pipe( plugins.sourcemaps.css.write('./') )    // produce map for non-minified css
          .pipe( gulp.dest(options.modcalc.styles.dest)),

      images: () => gulp.src( options.modcalc.images.src )
                    .pipe( plugins.imagemin(cfg.tasks.images.imagemin) )
                    .pipe( gulp.dest(options.modcalc.images.dest) ),

      markup: () => gulp.src( options.modcalc.markup.src )
                    .pipe( gulp.dest(options.modcalc.markup.dest) ),

      other:  () => gulp.src( options.modcalc.other.src )
                    .pipe( gulp.dest(options.modcalc.other.dest) ),

      scripts: () => gulp.src( options.modcalc.scripts.src )
                     .pipe( gulp.dest(options.modcalc.scripts.dest) ),

      zip: () => gulp.src( options.modcalc.zip.src )
            .pipe( plugins.zip(options.modcalc.zip.name) )
            .pipe( gulp.dest(options.modcalc.zip.dest) ),

      deploy: () => {

        const deployClean = () =>
          del([ `${cfg.paths.deploy}/modules/mod_starlink_calculator_outsourcing/**` ],
            {force: true}
          );

        const deployModules = () => {
          const mods = {
            ModuleAll:
              gulp.src([
                `${cfg.paths.dist}/mod_starlink_calculator_outsourcing/**`,
                `!${cfg.paths.dist}/mod_starlink_calculator_outsourcing/{fonts,images}*/**`
              ])
              .pipe( gulp.dest(`${cfg.paths.deploy}/modules/mod_starlink_calculator_outsourcing`) ),

            ModuleAssets:
              gulp.src( `${cfg.paths.dist}/mod_starlink_calculator_outsourcing/{fonts,images}*/**` )
              .pipe( gulp.dest(`${cfg.paths.deploy}/media/mod_starlink_calculator_outsourcing`) )
          };

          return merge(
            mods.ModuleAll,
            mods.ModuleAssets
          );
        };

        gulp.series(
          deployClean,
          deployModules
        )(done);

      }
  };

  [ 'clean',
    'styles',
    'images',
    'markup',
    'other',
    'scripts',
    'zip'
  ].forEach(x => { modcalc[x].displayName = `modcalc.${x}` });

  return modcalc;

};


