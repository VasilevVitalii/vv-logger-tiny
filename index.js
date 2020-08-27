//@ts-check
const lib_fs = require('fs-extra')
const lib_path = require('path')
const lib_app = require('./app.js')

exports.create = create
exports.check_path = check_path

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

/**
 * @param {string} path
 * @returns {Error}
 */
function check_path(path) {
    try {
        lib_fs.ensureDirSync(path)
        lib_fs.writeFileSync(lib_path.join(path, 'vv_logger_tiny_check_rules'), 'check rules for create files in this path', 'utf8')
        lib_fs.unlinkSync(lib_path.join(path, 'vv_logger_tiny_check_rules'))
        return undefined
    } catch (error) {
        return error
    }
}