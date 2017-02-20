/**
 * Task name: basscss/clean
 */
const path = require('path');
const taskName = path.basename(__dirname)+'/'+path.basename(__filename, path.extname(__filename));
const del = require('del');

module.exports = (gulp, plugins, options={}) => del(options.src);
