//@ts-check
const lib_app = require('./app.js')

exports.create = create

/**
 * @typedef {lib_app} app
 */
/**
 * @typedef {lib_app.constructor_options} options
 */
/**
 * @typedef {lib_app.message_options} message_options
 */
/**
 * @param {string} path
 * @param {options} [options]
 */
function create(path, options) {
    return new lib_app(path, options)
}