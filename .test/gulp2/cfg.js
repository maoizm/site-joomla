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
  default: {      /* default = development */
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

const run = runConfig[options.env] || runConfig.default;

const paths = {
  src:     '_src',
  build:   '_build',
  dist:    '_dist',
  include: '_src/_includes/'
};



const pluginPrepare = item => require(item[0])(item[1]);

module.exports = {
  options: options,
  paths: paths,
  browserSync: browserSync,
  run: run,

  task_config: {

    'bootstrap/styles': {
      src:  '_src/vendor/bootstrap-sass/styles/bootstrap.scss',
      dest: '_build/css',
      sassOptions: {
        includePaths: [
          '_src/_includes',
          'node_modules/bootstrap-sass/assets/stylesheets'
        ]
      },
      watchFiles:  [
          paths.include + '*.css',
          '_src/vendor/bootstrap-sass/styles/*.scss'
        ],
      browserSync: browserSync
    },
/*    'bootstrap/clean': {
      src: [ '_build/css/bootstrap*.{css,map}' ]
    },*/

    'basscss/styles': {
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
      watchFiles:  [
        paths.include + '*.css',
        '_src/vendor/basscss/**/*.css'
      ],
      browserSync: browserSync
    },

    'template/styles': {
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
                     ['postcss-custom-selectors', {}],
                     ['postcss-color-gray', {}],
                     ['postcss-color-hex-alpha', {}],
                     ['postcss-color-function', {}],
                     ['css-mqpacker', {sort: true}],
                     ['postcss-prettify', {}]
                   ].map(pluginPrepare),
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
    'template/clean': {
      src: '_build/css/template.*'
    },

    'all/styles-clean': {
      src: '_build/css/*.*'
    },


    'bootstrap/scripts': {
      src:  'node_modules/bootstrap-sass/assets/javascripts/{bootstrap,bootstrap.min}.js',
      dest: '_build/js'
    },
    'template/scripts': {
      src:   '_src/{mod_starlink,mod_starlink_calculator_outsourcing,templates/starlink}/scripts/*.js',
      dest:  '_build/js'
    },

    'all/scripts-clean': {
      src: '_build/js/*.*'
    },

    'all/markup': {
      src:  '_src/**/*.{html,php,xml}',
      dest: '_build',
      watchFiles: '_src/**/*.{html,php}',
      browserSync: browserSync
    },

    'all/images': {
      src: [
        '_src/{mod_starlink,mod_starlink_calculator_outsourcing,mod_starlink_services,templates/starlink}/images/**/*',
        '_src/{templates/starlink}/*.{jpg,png,gif,ico,svg}'
        ],
      dest: '_build'
    },

    'all/other': {
      src: [
        '_src/**/fonts/*.*',
        '_src/**/*.{ini,md,txt}',
        '!_src/vendor/**/*'
      ],
      dest: '_build'
    },


/*    'basscss/clean': {
      src: [ '_build/css/base*.{css,map}' ]
    },*/

/*    'mod_starlink/styles': {
      src:  '_src/mod_starlink/styles/starlink.pcss',
      dest: '_build/css',
      postcss: [
        [ 'postcss-import', { path: [ paths.include, '_build/css' ] } ],
        [ 'postcss-simple-vars', {} ],
        [ 'postcss-custom-properties', {preserve: false} ],
        [ 'postcss-apply', {} ],
        [ 'postcss-calc', {precision: 10} ],
        [ 'postcss-nesting', {} ],
        [ 'postcss-custom-media', {} ],
        [ 'postcss-media-minmax', {} ],
        [ 'postcss-custom-selectors', {} ],
        [ 'postcss-color-gray', {} ],
        [ 'postcss-color-hex-alpha', {} ],
        [ 'postcss-color-function', {} ],
        [ 'css-mqpacker', {sort: true} ],
        [ 'postcss-prettify', {} ]
      ].map( pluginPrepare ),
      watchFiles: run.watch ? false : [
          paths.include + '*.css',
          '_src/mod_starlink/styles/!*.pcss',
          '_build/css/{bootstrap,base}.css'
        ],
      browserSync: browserSync
    },
    'mod_starlink/clean': {
      src: [ '_build/css/starlink.*' ]
    },

    'mod_calc/styles': {
      src:  '_src/mod_starlink_calculator_outsourcing/styles/!*.pcss',
      dest: '_build/css',
      postcss: [
         [ 'postcss-custom-properties', {preserve: false} ],
         [ 'postcss-calc', {precision: 10} ],
         [ 'postcss-nesting', {} ],
         [ 'postcss-color-function', {} ],
         [ 'css-mqpacker', {sort: true} ],
         [ 'postcss-prettify', {} ]
       ].map( pluginPrepare ),
      watchFiles: run.watch ? false : [
          '_src/starlink_calculator_outsourcing/styles/!*.pcss',
          '_build/css/{bootstrap,base}.css'
        ],
      browserSync: browserSync
    },
    'mod_calc/clean': {
      src: [ '_build/css/starlink_calculator_outsourcing.*' ]
    },

    'mod_services/styles': {
      src:  '_src/mod_starlink_services/styles/!*.pcss',
      dest: '_build/css',
      postcss: [
              [ 'postcss-import', { path: [ paths.include, '_build/css' ] } ],
              [ 'postcss-custom-properties', {preserve: false} ],
              [ 'postcss-calc', {precision: 10} ],
              [ 'postcss-nesting', {} ],
              [ 'postcss-color-function', {} ],
              [ 'css-mqpacker', {sort: true} ],
              [ 'postcss-prettify', {} ]
            ].map( pluginPrepare ),
      watchFiles: run.watch ? false : [
          paths.include + '*.css',
          '_src/mod_starlink_services/styles/!*.pcss',
          '_build/css/{bootstrap,base}.css'
        ],
      browserSync: browserSync
    },
    'mod_services/clean': {
      src: [ '_build/css/starlink_services.*' ]
    },*/






    'all/markup-dist': {
      src: '_build/**/*.{html,php}',
      dest: '_dist'
    },

    'all/dist': {
      src: [ '_build/css/styles.css', '_build/**/*.{html,php}' ],
      dest: '_dist',
      watchFiles: false
    },

    'all::markup':  /* @todo experimental, do not use */
      function( target = 'dev' ) {
        const options = {
          'dev' : () => ({
              src:  '_src/**/*.{html,php}',
              dest: '_build',
              watchFiles: false,
              browserSync,
              target: 'dev'
            }),
          'dist': () => ({
              src:  '_build/**/*.{html,php}',
              dest: '_dist',
              target: 'dist'
            })
        };
        return (options[target])();
      },

    'all/styles-dist': {
      src: '_build/css/styles.css',
      dest: '_dist/css',
      postcss: [
        [ 'cssnano',
          {
            discardComments: { removeAll: true },
            autoprefixer: { 'browsers': '> 0.5%' }
          }
        ]
      ].map( pluginPrepare )
    }

  }

};