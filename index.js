//@ts-check
const app = require('./app.js')

exports.create = create

/**
 * @typedef {app.constructor_options} logger_constructor_options
 */

/**
 * @param {string} path
 * @param {logger_constructor_options} [options]
 */
function create(path, options) {
    return new app(path, options)
}