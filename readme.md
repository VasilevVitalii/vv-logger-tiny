## Install & Use
```cmd
npm i vv-logger-tiny
```
```js
const lib_vvl = require('vv-logger-tiny')
let vvl = new lib_vvl(__dirname)
// or
// let vvl = new lib_vvl(__dirname, {level: 'trace', file_name_mask: 'app_${yyyymmdd}.log', days_life: 4, write_to_console: true})
// warning!!! in file_name_mask supported only one date mask - ${yyyymmdd}!!!
vvl.trace('hello, trace!')
vvl.debug('hello, debug!')
vvl.error('hello, error!')
vvl.error(new Error('hello, error!'))

vvl.debug('user {0} delete document #{1}', undefined, ['Mark', 42])
vvl.error('error when user {0} delete document #{1}', new Error('some error'),['Mark', 42])
```
## Classes

<dl>
<dt><a href="#App">App</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#type_log_level">type_log_level</a> : <code>&#x27;trace&#x27;</code> | <code>&#x27;debug&#x27;</code> | <code>&#x27;error&#x27;</code></dt>
<dd><p>logger level, default = &#39;debug&#39;. if = &#39;trace&#39;, log work with [&#39;trace&#39;,&#39;debug&#39;,&#39;error&#39;], if = &#39;debug&#39; - [&#39;debug&#39;,&#39;error&#39;], if &#39;error&#39; - only &#39;error&#39;</p>
</dd>
<dt><a href="#type_options">type_options</a></dt>
<dd><p>logger options</p>
</dd>
</dl>

<a name="App"></a>

## App
**Kind**: global class  

* [App](#App)
    * [new App(path, [options])](#new_App_new)
    * [.set_option_days_life(days_life)](#App+set_option_days_life)
    * [.set_option_write_to_console(write_to_console)](#App+set_option_write_to_console)
    * [.set_option_level(level)](#App+set_option_level)
    * [.trace(message, [attachments], [message_extra])](#App+trace)
    * [.debug(message, [attachments], [message_extra])](#App+debug)
    * [.error(message, [attachments], [message_extra])](#App+error)

<a name="new_App_new"></a>

### new App(path, [options])

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | where store log files, default = __dirname |
| [options] | [<code>type\_options</code>](#type_options) | additional options |

<a name="App+set_option_days_life"></a>

### app.set\_option\_days\_life(days_life)
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| days_life | <code>number</code> | 

<a name="App+set_option_write_to_console"></a>

### app.set\_option\_write\_to\_console(write_to_console)
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| write_to_console | <code>boolean</code> | 

<a name="App+set_option_level"></a>

### app.set\_option\_level(level)
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| level | [<code>type\_log\_level</code>](#type_log_level) | 

<a name="App+trace"></a>

### app.trace(message, [attachments], [message_extra])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> |  |
| [attachments] | <code>string</code> \| <code>Error</code> \| <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;Error&gt;</code> |  |
| [message_extra] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | for example: message = 'myparam1 = {0} myparam2 = {1}', message_extra = [4, 'hello'], text result = 'myparam1 = 4, myparam2 = hello' |

<a name="App+debug"></a>

### app.debug(message, [attachments], [message_extra])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> |  |
| [attachments] | <code>string</code> \| <code>Error</code> \| <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;Error&gt;</code> |  |
| [message_extra] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | for example: message = 'step #{0} where {1}', message_extra = [4, 'i create new file'], text result = 'step #4 where i create new file' |

<a name="App+error"></a>

### app.error(message, [attachments], [message_extra])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> \| <code>Error</code> |  |
| [attachments] | <code>string</code> \| <code>Error</code> \| <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;Error&gt;</code> |  |
| [message_extra] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | for example: message = 'error #{0} when {1}', message_extra = [4, 'i create new file'], text result = 'error #4 when i create new file' |

<a name="type_log_level"></a>

## type\_log\_level : <code>&#x27;trace&#x27;</code> \| <code>&#x27;debug&#x27;</code> \| <code>&#x27;error&#x27;</code>
logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'

**Kind**: global typedef  
<a name="type_options"></a>

## type\_options
logger options

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [file_name_mask] | <code>string</code> | mask file name for store logger, default = 'app_${yyyymmdd}.log', where '${yyyymmdd}' - date write log. if mask without '${yyyymmdd}', delete old log files not working |
| [days_life] | <code>number</code> | number of days for which log files will be stored, default = 4, only current date = 1, disable delete old log files = 0. you can change it in an already created class in method set_option_days_life |
| [write_to_console] | <code>boolean</code> | write log to file and console (true) or in file only (false), default = true. you can change it in an already created class in method set_option_write_to_console |
| level | [<code>type\_log\_level</code>](#type_log_level) | logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'. you can change it in an already created class in method set_option_level |

