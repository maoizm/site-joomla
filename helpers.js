'use strict';
const upath = require('upath');
const util = require('util');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();



const stringly = o => JSON.stringify(o, null, 2);



/**
 *  loggy: pretty print any object, array etc and returns
 *  prettified string to caller
 *
 *  Usage:
 *      loggy(o);                  // console.log(o);
 *      loggy(o, {fn: util.log});  // util.log(o);
 *      let x = loggy( o, {fn: util.log} );
 *      let x = loggy( o, {fn: null} );
 *
 * */

const loggy = ( o, options = {} ) => {
    if (Object.keys(options).length == 0) {
        options = {
            showHidden: false,
            depth:      null,
            colors:     true,
            fn:         console.log
        };
    }
    else if ( !('fn' in options) ) {
        options.fn = console.log;
    };

    if ( typeof options.fn === 'function' )  {
        options.fn(util.inspect( o, options ));
    };

    return JSON.stringify( o, null, 2 );
};

exports = {stringly, loggy}