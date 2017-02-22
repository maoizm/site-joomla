/**
 * Task name: mod_calc/clean
 */

const path = require('path');
const taskName = path.basename(__dirname)+'/'+path.basename(__filename, path.extname(__filename));
const del = require('del');

const deb = require('../../cfg').options.debug;

module.exports = (gulp, plugins, options={}) => del(options.src);
