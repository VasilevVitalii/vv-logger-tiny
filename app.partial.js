//@ts-check

const lib_os = require('os')
//const lib_fs = require('fs-extra')
const lib_path = require('path')
const vvs = require('vv-shared')
const app = require('./app.js')

/**
 * @private
 * @typedef type_log_buffer
 * @property {string} text
 * @property {app.type_log_level} level
 * @property {string|Error} details
 * @property {Date} d
 * @property {boolean} writed
 */

/**
 * @typedef type_env
 * @property {string} path
 * @property {app.type_options} options
 * @property {type_log_buffer[]} buffer
 */

 /** @type {type_env} */
let env = {
    path: __dirname,
    options: {
        level: 'debug',
        days_life: 4,
        file_name_mask: 'app_${yyyymmdd}.log',
        write_to_console: true
    },
    buffer: []
}

exports.env = env
exports.go = go
exports.log = log

/**
 * @param {app.type_log_level} level
 * @param {string|Error} message
 * @param {string|Error|string[]|Error[]} attachments
 * @param {string|string[]} [message_extra]
 */
function log(level, message, attachments, message_extra) {
    try {

    } catch (error) {
        if (env.options.write_to_console === true) {
            console.log(vvs.toErrorMessage(error, 'in library "vv-logger-tiny" in process log message'))
        }
    }
}

function go() {

}

