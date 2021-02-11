export = App;
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
declare class App {
    /**
     * @param {string} path where store log files, default = __dirname
     * @param {constructor_options} [options] additional options
     */
    constructor(path: string, options?: constructor_options);
    /** @type {_partial.type_env} */
    _env: _partial.type_env;
    /**
     * @returns {string}
     */
    get_path(): string;
    /** @param {number} days_life*/
    set_option_days_life(days_life: number): void;
    /** @param {boolean} write_to_console*/
    set_option_write_to_console(write_to_console: boolean): void;
    /** @param {type_log_level} level*/
    set_option_level(level: type_log_level): void;
    /**
     * @param {string} message
     * @param {message_options} [options]
     */
    trace(message: string, options?: message_options): void;
    /**
     * @param {string} message
     * @param {message_options} [options]
     */
    debug(message: string, options?: message_options): void;
    /**
     * @param {string|Error} message
     * @param {message_options} [options]
     */
    error(message: string | Error, options?: message_options): void;
    /**
     * @param {callback_error} [callback]
     */
    save_to_file_force(callback?: callback_error): void;
}
declare namespace App {
    export { type_log_level, constructor_options, message_options, callback_error };
}
import _partial = require("./app.partial.js");
/**
 * logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'
 */
type type_log_level = "error" | "trace" | "debug";
/**
 * message options
 */
type message_options = {
    /**
     * for example: message = 'step #{0} where {1}', replace = [4, 'i create new file'], text result = 'step #4 where i create new file'
     */
    replace?: string | string[];
    /**
     * big attachment to message, for example - error with full stack
     */
    traces?: string | Error | string[] | Error[];
};
type callback_error = (error: Error) => any;
/**
 * logger options
 */
type constructor_options = {
    /**
     * mask file name for store logger, default = 'app_${yyyymmdd}.log', where '${yyyymmdd}' - date write log. if mask without '${yyyymmdd}', delete old log files not working
     */
    file_name_mask?: string;
    /**
     * number of days for which log files will be stored, default = 4, only current date = 1, disable delete old log files = 0. you can change it in an already created class in method set_option_days_life
     */
    days_life?: number;
    /**
     * write log to file and console (true) or in file only (false), default = true. you can change it in an already created class in method set_option_write_to_console
     */
    write_to_console?: boolean;
    /**
     * logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'. you can change it in an already created class in method set_option_level
     */
    level: type_log_level;
};
