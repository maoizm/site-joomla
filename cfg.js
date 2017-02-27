/**
 * Created by mao on 13.02.2017.
 */

const browserSync = require('browser-sync').create();


const knownOptions = {
  string: 'env',
  boolean: true,
  default: {
    env: process.env.NODE_ENV || 'development',
    debug: false
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
    cssnano: false,
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
    cssnano: true,
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
  build:   '_build',
  dist:    '_dist',
  include: '_src/_includes/'
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
  browserSync: browserSync,
  run: run,

  task_config: {

    'basscss.clean': {
      src: '_build/css/base.*'
    },

    'basscss.styles': {
      src:  '_src/vendor/basscss/base.css',
      dest: '_build/css',
      postcss: [
              [ 'postcss-import', {path: [paths.include]} ],
              [ 'postcss-custom-media', {} ],
              [ 'postcss-custom-properties', {} ],
              [ 'postcss-simple-vars', {} ],
              [ 'postcss-color-function', {} ],
              [ 'postcss-calc', {precision: 10} ],
              [ 'css-mqpacker', {sort: true} ],
              [ 'postcss-prettify', {} ]
            ].map( pluginPrepare ),
      sourcemaps: {},
      watchFiles:  [
        paths.include + '*.css',
        '_src/vendor/basscss/**/*.css'
      ],
      browserSync: browserSync
    },

    'bootstrap.clean': {
      src: '_build/css/bootstrap.*'
    },

    'bootstrap.scripts': {
      src:  'node_modules/bootstrap-sass/assets/javascripts/{bootstrap,bootstrap.min}.js',
      dest: '_build/js'
    },

    'bootstrap.styles': {
      src:  '_src/vendor/bootstrap-sass/styles/bootstrap.scss',
      dest: '_build/css',
      sassOptions: {
        includePaths: [
          '_src/_includes',
          'node_modules/bootstrap-sass/assets/stylesheets'
        ]
      },
      sourcemaps: {},
      watchFiles:  [
          paths.include + '*.css',
          '_src/vendor/bootstrap-sass/styles/*.scss'
        ],
      browserSync: browserSync
    },

    'images': {
      src: [
        '_src/{mod_starlink,mod_starlink_calculator_outsourcing,mod_starlink_services,templates/starlink}/images/**/*',
        '_src/templates*/starlink/*.{jpg,png,gif,ico,svg}'
      ],
      dest: '_build'
    },

    'images.dist': {
      src: [
        '_build/{mod_starlink,mod_starlink_calculator_outsourcing,mod_starlink_services,templates/starlink}/images/**/*',
        '_build/templates*/starlink/*.{jpg,png,gif,ico,svg}'
      ],
      dest: '_dist'
    },

    'markup': {
      src:  '_src/**/*.{html,php,xml}',
      dest: '_build',
      watchFiles: '_src/**/*.{html,php}',
      browserSync: browserSync
    },

    'markup.dist': {
      src: '_build/**/*.{html,php,xml}',
      dest: '_dist'
    },

    'mod_calc.clean': {},
    'mod_calc.styles': {},
    'mod_calc.scripts': {},
    'mod_calc.images': {},
    'mod_calc.markup': {},
    'mod_calc.other': {},
    'mod_calc.zip': {
      src: '_dist/mod_starlink_calculator_outsourcing/**/*',
      name: 'mod_starlink_calculator_outsourcing.zip',
      dest: '_zip/packages'
    },

    'mod_starlink.clean': {},
    'mod_starlink.styles': {},
    'mod_starlink.scripts': {},
    'mod_starlink.images': {},
    'mod_starlink.markup': {},
    'mod_starlink.other': {},
    'mod_starlink.zip': {
      src: '_dist/mod_starlink/**/*',
      name: 'mod_starlink.zip',
      dest: '_zip/packages'
    },

    'mod_map.clean': {},
    'mod_map.styles': {},
    'mod_map.scripts': {},
    'mod_map.images': {},
    'mod_map.markup': {},
    'mod_map.other': {},
    'mod_map.zip': {
      src: '_dist/mod_starlink_map/**/*',
      name: 'mod_starlink_map.zip',
      dest: '_zip/packages'
    },

    'mod_services.clean': {},
    'mod_services.styles': {},
    'mod_services.scripts': {},
    'mod_services.images': {},
    'mod_services.markup': {},
    'mod_services.other': {},
    'mod_services.zip': {
      src: '_dist/mod_starlink_services/**/*',
      name: 'mod_starlink_services.zip',
      dest: '_zip/packages'
    },

    'other': {
      src: [
        '_src/**/fonts/*.*',
        '_src/**/*.{ini,md,txt}',
        '!_src/vendor/**/*',
        '!_src/0_*/**/*'
      ],
      dest: '_build'
    },

    'other.dist': {
      src: [
        '_build/**/fonts/*.*',
        '_build/**/*.{ini,md,txt}'
      ],
      dest: '_dist'
    },


    'scripts.clean': {
      src: '_build/js/*.*'
    },

    'styles.clean': {
      src: '_build/css/*.*'
    },

    'styles.dist': {
      src:     '_build/css/template.css',
      dest:    '_dist/templates/starlink/css',
      postcss: [
                 ['cssnano',
                   {
                     discardComments: {removeAll: true},
                     autoprefixer:    {'browsers': '> 0.5%'}
                   }
                 ]
               ].map(pluginPrepare),
      sourcemaps: {loadMaps: true}
    },

    'scripts.dist': {
      src:     [
        '_build/js/**/*.js',
        '!_build/js/**/bootstrap.min.js'
      ],
      dest:    '_dist/templates/starlink/js',
      sourcemaps: {loadMaps: true},
      uglify:  {}
    },

    'template.clean': {
      src: [
        '_build/css/template.*',
        '_build/js/*.js'
      ]
    },

    'template.scripts': {
      src:   '_src/{mod_starlink,mod_starlink_calculator_outsourcing,templates/starlink}/scripts/*.js',
      dest:  '_build/js'
    },

    'template.styles': {
      src:         '_src/templates/starlink/styles/template.pcss',
      dest:        '_build/css',
      postcss:     [
                     ['postcss-import', {
                       path: [
                         paths.include,
                         '_build/css',
                         '_src/mod_starlink/styles',
                         '_src/mod_starlink_calculator_outsourcing/styles',
                         '_src/mod_starlink_services/styles'
                       ]
                     }],
                     ['postcss-simple-vars', {}],
                     ['postcss-custom-properties', {preserve: false}],
                     ['postcss-apply', {}],
                     ['postcss-calc', {precision: 10}],
                     ['postcss-nesting', {}],
                     ['postcss-custom-media', {}],
                     ['postcss-media-minmax', {}],
                     ['postcss-color-function', {}],
                     ['css-mqpacker', {sort: true}],
                     ['postcss-prettify', {}]
                   ].map(pluginPrepare),
      sourcemaps: {},
      watchFiles:  [
        paths.include + '*.css',
        '_src/templates/starlink/styles/*.pcss',
        '_src/mod_starlink/styles/*.pcss',
        '_src/mod_starlink_services/styles/*.pcss',
        '_src/mod_starlink_calculator_outsourcing/styles/*.pcss',
        '_build/css/{bootstrap,base}.css'
      ],
      browserSync: browserSync
    },
    'template.zip': {
      src: '_dist/templates/starlink/**/*',
      name: 'tpl_starlink.zip',
      dest: '_zip/packages'
    },

    'starlink_package.zip': {
      src: [
        '_zip/packages*/*.zip',
        '_dist/pkg*.xml'
      ],
      name: 'pkg_starlink.zip',
      dest: '_zip'
    }

  }

};