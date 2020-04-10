//@ts-check

const vvs = require('vv-shared')
const _partial = require('./app.partial.js')

/**
 * logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'
 * @typedef {'trace'|'debug'|'error'} type_log_level
 */

/**
 * logger options
 * @typedef type_options
 * @property {string} [file_name_mask] mask file name for store logger, default = 'app_${yyyymmdd}.log', where '${yyyymmdd}' - date write log. if mask without '${yyyymmdd}', delete old log files not working
 * @property {number} [days_life] number of days for which log files will be stored, default = 4, only current date = 1, disable delete old log files = 0. you can change it in an already created class in method set_option_days_life
 * @property {boolean} [write_to_console] write log to file and console (true) or in file only (false), default = true. you can change it in an already created class in method set_option_write_to_console
 * @property {type_log_level} level logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'. you can change it in an already created class in method set_option_level
 */

class App {

    /** 
     * @param {string} path where store log files, default = __dirname
     * @param {type_options} [options] additional options
     */
    constructor (path, options) {
        _partial.env.path = vvs.toString(path, _partial.env.path)
        if (!vvs.isEmpty(options)) {
            _partial.env.options.file_name_mask = vvs.toString(options.file_name_mask, _partial.env.options.file_name_mask)
            this.set_option_days_life(options.days_life)
            this.set_option_write_to_console(options.write_to_console)
            this.set_option_level(options.level)
        }
        _partial.go()
    }

    /** @param {number} days_life*/
    set_option_days_life(days_life) {
        _partial.env.options.days_life = vvs.toInt(days_life, _partial.env.options.days_life)
    }

    /** @param {boolean} write_to_console*/
    set_option_write_to_console(write_to_console) {
        _partial.env.options.write_to_console = vvs.toBool(write_to_console, _partial.env.options.write_to_console)
    }

    /** @param {type_log_level} level*/
    set_option_level(level) {
        _partial.env.options.level = (level === 'trace' || level === 'debug' || level === 'error' ? level : _partial.env.options.level)
    }

    /**
     * @param {string} message
     * @param {string|Error|string[]|Error[]} [attachments]
     * @param {string|string[]} [message_extra] for example: message = 'myparam1 = {0} myparam2 = {1}', message_extra = [4, 'hello'], text result = 'myparam1 = 4, myparam2 = hello'
     */    
    trace(message, attachments, message_extra) {
        _partial.log('trace', message, attachments, message_extra)
    }

    /**
     * @param {string} message
     * @param {string|Error|string[]|Error[]} [attachments]
     * @param {string|string[]} [message_extra] for example: message = 'step #{0} where {1}', message_extra = [4, 'i create new file'], text result = 'step #4 where i create new file'
     */    
    debug(message, attachments, message_extra) {
        _partial.log('debug', message, attachments, message_extra)
    }

    /**
     * @param {string|Error} message
     * @param {string|Error|string[]|Error[]} [attachments]
     * @param {string|string[]} [message_extra] for example: message = 'error #{0} when {1}', message_extra = [4, 'i create new file'], text result = 'error #4 when i create new file'
     */    
    error(message, attachments, message_extra) {
        _partial.log('error', message, attachments, message_extra)
    }
}

module.exports = App