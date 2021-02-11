export type type_log_buffer = {
    level: app.type_log_level;
    text_head: string;
    text_body: string;
    text_detail: string;
    d: Date;
    writed: boolean;
};
export type type_timer = {
    timer: NodeJS.Timer;
    timeout_msec: number;
    delete_old_files_tick: number;
};
export type type_env = {
    path: string;
    timer: type_timer;
    timer_first_start: boolean;
    options: app.constructor_options;
    buffer: type_log_buffer[];
};
/**
 * @param {app} app
 */
export function go(app: app): void;
/**
 * @param {app} app
 * @param {app.type_log_level} level
 * @param {string|Error} message
 * @param {app.message_options} options
 */
export function log(app: app, level: app.type_log_level, message: string | Error, options: app.message_options): void;
/**
 * @param {app} app
 * @param {app.callback_error} [callback]
 */
export function save_to_file_force(app: app, callback?: app.callback_error): void;
import app = require("./app.js");
