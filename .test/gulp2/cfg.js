/**
 * Created by mao on 13.02.2017.
 */

const browserSync = require('browser-sync').create();

const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};
const options = require('minimist')(process.argv.slice(2), knownOptions);
const production = (options.env === 'production');

const paths = {
  src:     '_src',
  build:   '_build',
  dist:    '_dist',
  include: '_src/_includes/'
};



const pluginPrepare = item => require(item[0])(item[1]);

module.exports = {
  options,
  production: (options.env === 'production'),
  paths,
  browserSync,

/*  postcss: [
    [ 'postcss-mixins', {} ],
    [ 'postcss-simple-vars', {} ],
    [ 'postcss-custom-properties', {} ],
    [ 'postcss-apply', {} ],
    [ 'postcss-calc', {precision: 10} ],
    [ 'postcss-nesting', {} ],
    [ 'postcss-custom-media', {} ],
    [ 'postcss-extend', {} ],
    [ 'postcss-media-minmax', {} ],
    [ 'postcss-custom-selectors', {} ],
    [ 'postcss-color-hwb', {} ],
    [ 'postcss-color-gray', {} ],
    [ 'postcss-color-hex-alpha', {} ],
    [ 'postcss-color-function', {} ],
    [ 'postcss-for', {} ],
    [ 'postcss-discard-comments', {} ],
    [ 'cssnano', {} ],
    [ 'autoprefixer', {'browsers': '> 1%'} ],
    [ 'postcss-prettify', {} ],
    [ 'css-mqpacker', {sort: true} ]
  ].map( pluginPrepare ),*/


  task_config: {

    'bootstrap:styles': {
      src:  '_src/vendor/bootstrap-sass/styles/bootstrap.scss',
      dest: '_build/css',
      sassOptions: {
        includePaths: [
          '_src/_includes',
          'node_modules/bootstrap-sass/assets/stylesheets'
        ]
      },
      watchFiles: exports.production ? false : [
          paths.include + '*.css',
          '_src/vendor/bootstrap-sass/styles/*.scss'
        ],
      browserSync
    },

    'basscss:styles': {
      src:  '_src/vendor/basscss/base.css',
      dest: '_build/css',
      postcss: [
              [ 'postcss-import', {path: [paths.include]} ],
              [ 'postcss-custom-media', {} ],
              [ 'postcss-custom-properties', {} ],
              [ 'postcss-simple-vars', {} ],
              [ 'postcss-color-function', {} ],
              [ 'postcss-calc', {precision: 10} ],
 //             [ 'postcss-discard-comments', {} ],
              [ 'css-mqpacker', {sort: true} ],
              [ 'postcss-prettify', {} ]
            ].map( pluginPrepare ),
      watchFiles: exports.production ? false : [
          paths.include + '*.css',
          '_src/vendor/basscss/**/*.css'
        ],
      browserSync
    },

    'mod_starlink:styles': {
      src:  '_src/mod_starlink/styles/{styles,print,offline}.pcss',
      dest: '_build/css',
      postcss: [
        [ 'postcss-import', { path: [ paths.include, '_build/css' ] } ],
        [ 'postcss-mixins', {} ],
        [ 'postcss-simple-vars', {} ],
        [ 'postcss-custom-properties', {} ],
        [ 'postcss-apply', {} ],
        [ 'postcss-calc', {precision: 10} ],
        [ 'postcss-nesting', {} ],
        [ 'postcss-custom-media', {} ],
        [ 'postcss-extend', {} ],
        [ 'postcss-media-minmax', {} ],
        [ 'postcss-custom-selectors', {} ],
        [ 'postcss-color-hwb', {} ],
        [ 'postcss-color-gray', {} ],
        [ 'postcss-color-hex-alpha', {} ],
        [ 'postcss-color-function', {} ],
        [ 'postcss-for', {} ],
 //       [ 'postcss-discard-comments', {} ],
 //       [ 'autoprefixer', {'browsers': '> 1%'} ],
        [ 'css-mqpacker', {sort: true} ]
      ].map( pluginPrepare ),
      watchFiles: exports.production ? false : [
          paths.include + '*.css',
          '_src/mod_starlink/styles/*.{,p}css',
          '_build/css/{bootstrap,base}.css'
        ],
      browserSync
    },

    'all:markup': {
      src:  '_src/**/*.{html,php}',
      dest: '_build',
      watchFiles: false,
      browserSync
    },

    'all:markup:dist': {
      src: '_build/**/*.{html,php}',
      dest: '_dist'
    },

    'all::markup':
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

    'all:styles:dist': {
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