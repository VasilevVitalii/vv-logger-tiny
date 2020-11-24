//@ts-check

const vvs = require('vv-shared')
const _partial = require('./app.partial.js')

/**
 * logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'
 * @typedef {'trace'|'debug'|'error'} type_log_level
 */

/**
 * logger options
 * @typedef constructor_options
 * @property {string} [file_name_mask] mask file name for store logger, default = 'app_${yyyymmdd}.log', where '${yyyymmdd}' - date write log. if mask without '${yyyymmdd}', delete old log files not working
 * @property {number} [days_life] number of days for which log files will be stored, default = 4, only current date = 1, disable delete old log files = 0. you can change it in an already created class in method set_option_days_life
 * @property {boolean} [write_to_console] write log to file and console (true) or in file only (false), default = true. you can change it in an already created class in method set_option_write_to_console
 * @property {type_log_level} level logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'. you can change it in an already created class in method set_option_level
 */

/**
 * message options
 * @typedef message_options
 * @property {string|string[]} [replace] for example: message = 'step #{0} where {1}', replace = [4, 'i create new file'], text result = 'step #4 where i create new file'
 * @property {string|Error|string[]|Error[]} [traces] big attachment to message, for example - error with full stack
 */

/**
 * @callback callback_error
 * @param {Error} error
 */

class App {

    /**
     * @param {string} path where store log files, default = __dirname
     * @param {constructor_options} [options] additional options
     */
    constructor (path, options) {

        /** @type {_partial.type_env} */
        this._env = {
            path: vvs.toString(path, __dirname),
            timer: {
                timer: undefined,
                delete_old_files_tick: 0,
                timeout_msec: 1000
            },
            timer_first_start: false,
            options: {
                level: 'debug',
                days_life: 4,
                file_name_mask: vvs.findPropertyValueInObject(options, 'file_name_mask', 'app_${yyyymmdd}.log'),
                write_to_console: true
            },
            buffer: []
        }

        if (!vvs.isEmpty(options)) {
            this.set_option_days_life(options.days_life)
            this.set_option_write_to_console(options.write_to_console)
            this.set_option_level(options.level)
        }

        _partial.go(this)
    }

    /**
     * @returns {string}
     */
    get_path() {
        return this._env.path
    }

    /** @param {number} days_life*/
    set_option_days_life(days_life) {
        this._env.options.days_life = vvs.toInt(days_life, this._env.options.days_life)
        this._env.timer.delete_old_files_tick = 0
    }

    /** @param {boolean} write_to_console*/
    set_option_write_to_console(write_to_console) {
        this._env.options.write_to_console = vvs.toBool(write_to_console, this._env.options.write_to_console)
    }

    /** @param {type_log_level} level*/
    set_option_level(level) {
        this._env.options.level = (level === 'trace' || level === 'debug' || level === 'error' ? level : this._env.options.level)
    }

    /**
     * @param {string} message
     * @param {message_options} [options]
     */
    trace(message, options) {
        _partial.log(this, 'trace', message, options)
    }

    /**
     * @param {string} message
     * @param {message_options} [options]
     */
    debug(message, options) {
        _partial.log(this, 'debug', message, options)
    }

    /**
     * @param {string|Error} message
     * @param {message_options} [options]
     */
    error(message, options) {
        _partial.log(this, 'error', message, options)
    }

    /**
     * @param {callback_error} [callback]
     */
    save_to_file_force(callback) {
        _partial.save_to_file_force(this, callback)
    }
}

module.exports = App