/**
 * Created by mao on 13.02.2017.
 */

const knownOptions = {
  string: 'env',
  boolean: ['debug', 'help'],
  default: {
    env: process.env.NODE_ENV || 'development',
    debug: true,
    help: false
  }
};
const options = require('minimist')(process.argv.slice(2), knownOptions);



const runConfig = {
  default: 'development',

  development: {
    sourcemaps: {
      css: true,
      js: true
    },
    postcssMinify: false,
    autoprefixer: false,
    prettify: true,
    uglify: false,
    imagemin: false,
    watch: true,
    browserSync: false
  },

  production: {
    sourcemaps: {
      css: false,
      js: false
    },
    postcssMinify: true,
    autoprefixer: true,
    prettify: false,
    uglify: true,
    imagemin: true,
    watch: false,
    browserSync: false
  }
};

const run = runConfig[options.env] || Object.assign(runConfig[runConfig.default], {'this is default configuration': true});

const paths = {
  src:     '_src',
  build:   '_build', /* @TO+DO remove this?  No */
  dist:    '_dist',
  zip:     '_zip',
  deploy:  'c:/laragon/www/joomla',
  include: '_src/_includes',
  tmp:     '_build/_tmp'
};


/**
 * Requires all postCSS plugins from array of names and options
 *
 * @param item  item of Plugins' array: [ pluginName, { pluginOptions } ]
 */
const pluginPrepare = item => require(item[0])(item[1]);


module.exports = {
  options: options,
  paths: paths,
  browserSync: false,
  run: run,

  tasks: {


    clean: {
      dist: {  // non-greedy
        src: [
          `${paths.dist}/libraries/**`,
          `${paths.dist}/mod_starlink/**`,
          `${paths.dist}/mod_starlink_calculator_outsourcing/**`,
          `${paths.dist}/mod_starlink_map/**`,
          `${paths.dist}/mod_starlink_services/**`,
          `${paths.dist}/templates/starlink/**`
        ]
      }
    },


    basscss: {
        src:         `${paths.src}/vendor/basscss/base.css`,
        dest:        paths.tmp + '/css',
        postcss:     [
                       ['postcss-import', {path: [paths.include]}],
                       ['postcss-custom-media', {}],
                       ['postcss-custom-properties', {}],
                       ['postcss-simple-vars', {}],
                       ['postcss-color-function', {}],
                       ['postcss-calc', {precision: 10}],
                       ['css-mqpacker', {sort: true}],
                       ['postcss-discard-comments', {}],
                       ['postcss-prettify', {}]
                     ].map(pluginPrepare),
        sourcemaps:  {},
        watchFiles:  [
          paths.include + '/*.css',
          `${paths.src}/vendor/basscss/**/*.css`
        ]
    },



    bootstrap: {
        styles: {
          src:  `${paths.src}/vendor/bootstrap-sass/styles/bootstrap.scss`,
          dest: paths.tmp + '/css',
          sassOptions: {
            includePaths: [
              paths.include,
              'node_modules/bootstrap-sass/assets/stylesheets'
            ]
          },
          sourcemaps: {},
          watchFiles: [
            paths.include + '/*.css',
            `${paths.src}/vendor/bootstrap-sass/styles/*.scss`
          ]
        }
    },



    images: {
      src: [ `${paths.src}/*mod_starlink/images/**/*.{jp*g,png,svg,ico}`,
        `${paths.src}/*mod_starlink_calculator_outsourcing/images/**/*.*`,
        `${paths.src}/*mod_starlink_services/images/*.*`,
        `${paths.src}/*templates/starlink/images/**/*`
      ],
      imagemin: [ 'gifsicle', 'jpegtran', 'optipng' ].map(
        item => require('gulp-imagemin')[item]()
      ),
      dest: paths.dist
    },



    markup: {
      src:  [ `${paths.src}/**/*.{html,php,xml}`, `!${paths.src}/0_database/**/*` ],
      dest: paths.dist,
      watchFiles: `${paths.src}/**/*.{html,php}`
    },



    other: {
      src: [
        `${paths.src}/**/fonts/*.*`,
        `${paths.src}/**/*.{ini,md,txt}`,
        `!${paths.src}/vendor/**/*`,
        `!${paths.src}/0_*/**/*`
      ],
      dest: paths.dist
    },



    scripts: {
      src: [
        'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
        `${paths.src}/mod_starlink_calculator_outsourcing/scripts/*.js`,
        `${paths.src}/templates/starlink/scripts/scripts.js`
      ],
      srcNoConcat: [
        `${paths.src}/templates/starlink/scripts/jui/*.js`,
        `${paths.src}/vendor/jquery-ui/jquery-ui-1.12.1.full/jquery-ui*.js`,
        'node_modules/jquery/dist/jquery.min.js'
      ],
      sourcemaps: {loadMaps: true},
      dest: `${paths.dist}/templates/starlink/js`,
      watchFiles:  [
        `${paths.src}/templates/starlink/scripts/*.js`,
        `${paths.src}/mod_starlink_calculator_outsourcing/scripts/*.js`
      ]
    },



    styles: {},
    template: {
      styles: {
        src:         `${paths.src}/templates/starlink/styles/template.pcss`,
        dest:        `${paths.dist}/templates/starlink/css`,
        postcss:     [
           [
             'postcss-import', {
                 path: [
                   paths.include,
                   `${paths.tmp}/css`,
                   `${paths.src}/mod_starlink_calculator_outsourcing/styles`,
                   `${paths.src}/mod_starlink_services/styles`
                 ]
              }
           ],
           [ 'postcss-simple-vars', {} ],
           [ 'postcss-custom-properties', {preserve: false} ],
           [ 'postcss-apply', {} ],
           [ 'postcss-remove-root', {} ],
           [ 'postcss-calc', {precision: 10} ],
           [ 'postcss-nesting', {} ],
           [ 'postcss-custom-media', {} ],
           [ 'postcss-media-minmax', {} ],
           [ 'postcss-color-function', {} ],
           [ 'css-mqpacker', {sort: true} ],
           [ 'postcss-discard-comments', {} ],
           [ 'postcss-prettify', {} ]
         ].map(pluginPrepare),
        postcssMinify:  [
           [
             'cssnano',
             {
               discardComments: {removeAll: true},
               autoprefixer:    {'browsers': '> 0.5%'}
             }
           ]
         ].map(pluginPrepare),
        sourcemaps: {},
        watchFiles:  [
          `${paths.include}*.css`,
          `${paths.src}/vendor/basscss/**/*.css`,
          `${paths.src}/vendor/bootstrap-sass/styles/**/*.scss`,
          `${paths.src}/mod_starlink_services/styles/*.pcss`,
          `${paths.src}/mod_starlink_calculator_outsourcing/styles/*.pcss`,
          `${paths.src}/templates/starlink/styles/*.pcss`
        ]
      }
    },



    modcalc: {
      clean: `${paths.dist}/mod_starlink_calculator_outsourcing/**`,
      styles: {
        src: `${paths.src}/mod_starlink_calculator_outsourcing/styles/*.pcss`,
        dest: `${paths.dist}/mod_starlink_calculator_outsourcing/css`,
        postcss:     [
                       ['postcss-custom-properties', {}],
                       ['postcss-color-function', {}],
                       ['postcss-calc', {precision: 10}],
                       ['css-mqpacker', {sort: true}],
                       ['postcss-discard-comments', {}],
                       ['postcss-prettify', {}]
                     ].map(pluginPrepare)
      },
      scripts: {
        src: `${paths.src}/mod_starlink_calculator_outsourcing/scripts/*.js`,
        dest: `${paths.dist}/mod_starlink_calculator_outsourcing/js`
      },
      images: {
        src: `${paths.src}/mod_starlink_calculator_outsourcing/images/*.{png,svg,jpg}`,
        dest: `${paths.dist}/mod_starlink_calculator_outsourcing/images`
      },
      markup: {
        src: `${paths.src}/mod_starlink_calculator_outsourcing/*.{html,php,xml}`,
        dest: `${paths.dist}/mod_starlink_calculator_outsourcing/`
      },
      other: {
        src: `${paths.src}/mod_starlink_calculator_outsourcing/*.{ini,md.txt}`,
        dest: `${paths.dist}/mod_starlink_calculator_outsourcing/`
      },
      zip: {
        src: `${paths.dist}/mod_starlink_calculator_outsourcing/**/*.*`,
        dest:`${paths.dist}/mod_starlink_calculator_outsourcing/`,
        name:`mod_starlink_calculator_outsourcing`
      }
    },



    modstarlink: {
      clean: {

      },
      styles: {

      },
      scripts: {

      },
      images: {

      },
      markup: {

      },
      other: {

      }
    },



    modservices: {
      clean: {

      },
      styles: {

      },
      scripts: {

      },
      images: {

      },
      markup: {

      },
      other: {

      }
    },



    modmap: {
      clean: {

      },
      styles: {

      },
      scripts: {

      },
      images: {

      },
      markup: {

      },
      other: {

      }
    }

  }

};