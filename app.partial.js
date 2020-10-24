//@ts-check

const lib_os = require('os')
const lib_fs = require('fs-extra')
const lib_path = require('path')
const vvs = require('vv-shared')
const app = require('./app.js')

/**
 * @private
 * @typedef type_log_buffer
 * @property {app.type_log_level} level
 * @property {string} text_head
 * @property {string} text_body
 * @property {string} text_detail
 * @property {Date} d
 * @property {boolean} writed
 */

/**
 * @typedef type_timer
 * @property {NodeJS.Timer} timer
 * @property {number} timeout_msec
 * @property {number} delete_old_files_tick
 */

/**
 * @typedef type_env
 * @property {string} path
 * @property {type_timer} timer
 * @property {boolean} timer_first_start
 * @property {app.constructor_options} options
 * @property {type_log_buffer[]} buffer
 */

exports.go = go
exports.log = log
exports.save_to_file_force = save_to_file_force

/**
 * @param {app} app
 * @param {'log'|'error'} type
 * @param {string} message
 */
function echo(app, type, message) {
    if (app._env.options.write_to_console !== true) return
    if (type === 'log') {
        console.log(vvs.toString(message,'').trim())
    } else if (type === 'error') {
        console.warn(vvs.toString(message,'').trim())
    }
}

/**
 * @param {app} app
 * @param {app.type_log_level} level
 * @param {string|Error} message
 * @param {app.message_options} options
 */
function log(app, level, message, options) {
    try {

        switch(app._env.options.level) {
            case 'error':
                if (level !== 'error') return
                break;
            case 'debug':
                if (!(level === 'error' || level === 'debug')) return
                break;
            case 'trace':
                if (!(level === 'error' || level === 'debug' || level === 'trace')) return
                break;
            default:
                return
        }

        let d = new Date()

        /** @type {type_log_buffer} */
        let buffered_message = {
            level: level,
            writed: false,
            d: d,
            text_head: '--> '.concat(vvs.formatDate(d, 1041084),' ',level.toUpperCase(),': ') ,
            text_body: (typeof message === 'string' ? message : vvs.toErrorMessage(message, undefined, undefined, 'message')).trim(),
            text_detail: ''
        }


        if (!vvs.isEmpty(options)) {
            if (!vvs.isEmpty(options.replace)) {
                let message_replace_list = vvs.toArray(options.replace)
                if (message_replace_list.length > 0) {
                    buffered_message.text_body = vvs.format(buffered_message.text_body, message_replace_list).trim()
                }
            }

            if (!vvs.isEmpty(options.traces)) {
                /** @type {string[]} */
                let trace_list = []

                if (Array.isArray(options.traces)) {
                    options.traces.forEach(a => {
                        trace_list.push(typeof a === 'string' ? a.trim() : vvs.toErrorMessage(a, undefined, undefined, 'stack').trim())
                    })
                } else if (typeof options.traces === 'string') {
                    trace_list.push(options.traces.trim())
                } else {
                    trace_list.push(vvs.toErrorMessage(options.traces, undefined, undefined, 'stack').trim())
                }
                trace_list = trace_list.filter(f => !vvs.isEmptyString(f))

                if (vvs.isEmptyString(buffered_message.text_body) && trace_list.length > 0) {
                    buffered_message.text_body = trace_list[0]
                    trace_list = trace_list.slice(1, trace_list.length)
                }

                if (trace_list.length > 0) {
                    /** @type {string[]} */
                    let text_detail = []
                    trace_list.forEach((t, i) => {
                        text_detail.push(' -> TRACE #'.concat(i.toString()))
                        text_detail.push('    '.concat(t))
                    })

                    buffered_message.text_detail = text_detail.join(lib_os.EOL)
                }
            }
        }

        echo(app, (level === 'error' ? 'error' : 'log'), buffered_message.text_head.concat(buffered_message.text_body, lib_os.EOL, buffered_message.text_detail))

        app._env.buffer.push(buffered_message)
    } catch (error) {
        echo(app, 'error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" in process log message'))
    }
}

/**
 * @param {app} app
 * @param {Date} d
 * @returns {string}
 */
function get_file_name(app, d) {
    if (!vvs.isEmpty(d)) {
        return vvs.replaceAll(app._env.options.file_name_mask, '${yyyymmdd}', vvs.formatDate(d, 112))
    }
    return vvs.replaceAll(app._env.options.file_name_mask, '${yyyymmdd}', '[0-9]{8}')
}

/**
 * @param {app} app
 */
function go(app) {
    if (!vvs.isEmpty(app._env.timer.timer)) {
        clearTimeout(app._env.timer.timer)
        app._env.timer.timer = undefined
    }

    app._env.timer.timer = setTimeout(function tick() {
        lib_fs.ensureDir(app._env.path, undefined, error => {
            if (!vvs.isEmpty(error)) {
                app._env.timer.timeout_msec = (app._env.timer.timeout_msec + 3000 > 60000 ? 60000 : app._env.timer.timeout_msec + 3000)
                echo(app, 'error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on create path "{0}"', app._env.path))
                app._env.timer.timer = setTimeout(tick, app._env.timer.timeout_msec)
                return
            }
            save_to_file(app, () => {
                delete_old_files(app, () => {
                    app._env.timer.timer = setTimeout(tick, 1000)
                })
            })
        })
    }, app._env.timer.timeout_msec)
}

/**
 * @param {app} app
 * @param {app.callback_error} [callback]
 */
function save_to_file_force(app, callback) {
    lib_fs.ensureDir(app._env.path, undefined, error => {
        if (!vvs.isEmpty(error)) {
            if (vvs.isFunction(callback)) {
                callback(error)
            }
            return
        }
        save_to_file(app, () => {
            if (vvs.isFunction(callback)) {
                callback(undefined)
            }
        })
    })
}

/**
 * @param {app} app
 * @param {function} callback
 */
function save_to_file(app, callback) {

    /** @type {string[]} */
    let text_for_file = []

    /** @type {Date} */
    let d_first

    app._env.buffer.filter(f => f.writed !== true).forEach(log => {
        if (vvs.isEmpty(d_first)) {
            d_first = vvs.toDateWithoutTime(log.d)
        }

        if (!vvs.isEmpty(d_first) && vvs.equal(vvs.formatDate(d_first, 112), vvs.formatDate(log.d, 112))) {
            log.writed = true
            let log_detail = vvs.isEmptyString(log.text_detail) ? '' : lib_os.EOL.concat(log.text_detail, lib_os.EOL)
            text_for_file.push(log.text_head.concat(log.text_body, log_detail))
        }
    })
    if (text_for_file.length <= 0) {
        callback()
        return
    }
    text_for_file.push('')

    let full_file_name = lib_path.join(app._env.path, get_file_name(app, d_first))
    lib_fs.appendFile(full_file_name, text_for_file.join(lib_os.EOL), {encoding: 'utf8'}, error => {
        if (!vvs.isEmpty(error)) {
            echo(app, 'error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on save file "{0}"', full_file_name))
        }
        callback()
    })
}

/**
 * @param {app} app
 * @param {function} callback
 */
function delete_old_files(app, callback) {
    if (app._env.options.days_life <= 0) {
        callback()
        return
    }

    if (app._env.timer.delete_old_files_tick > 10800) {
        app._env.timer.delete_old_files_tick = 0
    }

    if (app._env.timer.delete_old_files_tick !== 0) {
        app._env.timer.delete_old_files_tick++
        callback()
        return
    }
    app._env.timer.delete_old_files_tick++

    let now = new Date()

    /** @type {string[]} */
    let undeletable_files = []
    for (let i = 0; i < app._env.options.days_life; i++) {
        undeletable_files.push(get_file_name(app, vvs.dateAdd('day', -1 * i, now)))
    }

    lib_fs.readdir(app._env.path, (error, files) => {
        if (!vvs.isEmpty(error)) {
            echo(app, 'error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on scan dir "{0}"', app._env.path))
            callback()
            return
        }

        let log_file_mask = new RegExp(get_file_name(app, null))
        let old_log_files = files.filter(f => log_file_mask.test(f) === true && !undeletable_files.includes(f))
        old_log_files.forEach(file_for_delete => {
            let full_file_for_delete = lib_path.join(app._env.path, file_for_delete)
            lib_fs.unlink(full_file_for_delete, error => {
                if (!vvs.isEmpty(error)) {
                    echo(app, 'error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on delete olf log file "{0}"', file_for_delete))
                }
            })
        })

        callback()
    })
}