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
 * @property {app.type_options} options
 * @property {type_log_buffer[]} buffer
 */

 /** @type {type_env} */
let env = {
    path: __dirname,
    timer: {
        timer: undefined,
        delete_old_files_tick: 0,
        timeout_msec: 1000
    },
    timer_first_start: false,
    options: {
        level: 'debug',
        days_life: 4,
        file_name_mask: 'app_${yyyymmdd}.log',
        write_to_console: true
    },
    buffer: []
}

/** @type {NodeJS.Timer} */
let timer = undefined

exports.env = env
exports.go = go
exports.log = log

/**
 * @param {'log'|'error'} type
 * @param {string} message
 */
function echo(type, message) {
    if (env.options.write_to_console !== true) return
    if (type === 'log') {
        console.log(vvs.toString(message,'').trim())
    } else if (type === 'error') {
        console.error(vvs.toString(message,'').trim())
    }
}

/**
 * @param {app.type_log_level} level
 * @param {string|Error} message
 * @param {string|Error|string[]|Error[]} attachments
 * @param {string|string[]} [message_extra]
 */
function log(level, message, attachments, message_extra) {
    try {

        switch(env.options.level) {
            case 'error':
                if (!(level === 'error')) return
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

        let message_extra_list = vvs.toArray(message_extra)
        if (message_extra_list.length > 0) {
            buffered_message.text_body = vvs.format(buffered_message.text_body, message_extra_list).trim()
        }

        if (!vvs.isEmpty(attachments)) {
            /** @type {string[]} */
            let attach_list = []

            if (Array.isArray(attachments)) {
                attachments.forEach(a => {
                    attach_list.push(typeof a === 'string' ? a.trim() : vvs.toErrorMessage(a, undefined, undefined, 'stack').trim())
                })
            } else if (typeof attachments === 'string') {
                attach_list.push(attachments.trim())
            } else {
                attach_list.push(vvs.toErrorMessage(attachments, undefined, undefined, 'stack').trim())
            }
            attach_list = attach_list.filter(f => !vvs.isEmptyString(f))

            if (vvs.isEmptyString(buffered_message.text_body) && attach_list.length > 0) {
                buffered_message.text_body = attach_list[0]
                attach_list = attach_list.slice(1, attach_list.length)
            }

            if (attach_list.length > 0) {
                buffered_message.text_detail = attach_list.join(lib_os.EOL.concat(lib_os.EOL))
            }
        }

        echo((level === 'error' ? 'error' : 'log'), buffered_message.text_head.concat(buffered_message.text_body, lib_os.EOL, buffered_message.text_detail))

        env.buffer.push(buffered_message)
    } catch (error) {
        echo('error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" in process log message'))
    }
}

/**
 * @param {Date} d
 * @returns {string}
 */
function get_file_name(d) {
    if (!vvs.isEmpty(d)) {
        return vvs.replaceAll(env.options.file_name_mask, '${yyyymmdd}', vvs.formatDate(d, 112))
    }
    return vvs.replaceAll(env.options.file_name_mask, '${yyyymmdd}', '[0-9]{8}')
}

function go() {
    if (!vvs.isEmpty(timer)) {
        clearTimeout(timer)
        timer = undefined
    }

    timer = setTimeout(function tick() {
        lib_fs.ensureDir(env.path, undefined, error => {
            if (!vvs.isEmpty(error)) {
                env.timer.timeout_msec = (env.timer.timeout_msec + 3000 > 60000 ? 60000 : env.timer.timeout_msec + 3000)
                echo('error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on create path "{0}"', env.path))
                timer = setTimeout(tick, env.timer.timeout_msec)
                return
            }
            save_to_file(() => {
                delete_old_files(() => {
                    timer = setTimeout(tick, 1000)                
                })
            })
        })
    }, env.timer.timeout_msec)
}

/**
 * @param {function} callback
 */
function save_to_file(callback) {

    /** @type {string[]} */
    let text_for_file = []

    /** @type {Date} */
    let d_first

    env.buffer.filter(f => f.writed !== true).forEach(log => {
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

    let full_file_name = lib_path.join(env.path, get_file_name(d_first))
    lib_fs.appendFile(full_file_name, text_for_file.join(lib_os.EOL), {encoding: 'utf8'}, error => {
        if (!vvs.isEmpty(error)) {
            echo('error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on save file "{0}"', full_file_name))
        }
        callback()
    })
}

/**
 * @param {function} callback
 */
function delete_old_files(callback) {
    if (env.options.days_life <= 0) {
        callback()
        return
    }

    if (env.timer.delete_old_files_tick > 10800) {
        env.timer.delete_old_files_tick = 0
    }

    if (env.timer.delete_old_files_tick !== 0) {
        env.timer.delete_old_files_tick++
        callback()
        return
    }
    env.timer.delete_old_files_tick++

    let now = new Date()

    /** @type {string[]} */
    let undeletable_files = []
    for (let i = 0; i < env.options.days_life; i++) {
        undeletable_files.push(get_file_name(vvs.dateAdd('day', -1 * i, now)))
    }

    lib_fs.readdir(env.path, (error, files) => {
        if (!vvs.isEmpty(error)) {
            echo('error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on scan dir "{0}"', env.path))
            callback()
            return
        }

        let log_file_mask = new RegExp(get_file_name(null))
        let old_log_files = files.filter(f => log_file_mask.test(f) === true && !undeletable_files.includes(f))
        old_log_files.forEach(file_for_delete => {
            let full_file_for_delete = lib_path.join(env.path, file_for_delete)
            lib_fs.unlink(full_file_for_delete, error => {
                if (!vvs.isEmpty(error)) {
                    echo('error', vvs.toErrorMessage(error, 'in library "vv-logger-tiny" on delete olf log file "{0}"', file_for_delete))
                }
            })
        })

        callback()
    })
}