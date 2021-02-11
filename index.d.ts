export type app = lib_app;
export type options = {
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
    level: lib_app.type_log_level;
};
export type message_options = {
    /**
     * for example: message = 'step #{0} where {1}', replace = [4, 'i create new file'], text result = 'step #4 where i create new file'
     */
    replace?: string | string[];
    /**
     * big attachment to message, for example - error with full stack
     */
    traces?: string | string[] | Error | Error[];
};
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
export function create(path: string, options?: options): lib_app;
/**
 * @param {string} path
 * @returns {Error}
 */
export function check_path(path: string): Error;
import lib_app = require("./app.js");
