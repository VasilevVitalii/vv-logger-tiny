## Install & Use
```cmd
npm i vv-logger-tiny
```
```js
const logger = require('vv-logger-tiny').create(__dirname)
// or
// const logger = require('./index.js').create(__dirname, {level: 'trace', file_name_mask: 'app_${yyyymmdd}.log', days_life: 4, write_to_console: true})
// warning!!! in file_name_mask supported only one date mask - ${yyyymmdd}!!!

logger.trace('hello, trace!')
logger.debug('hello, debug!')
logger.error('hello, error!')
logger.error(new Error('hello, error!'))
logger.debug('user {0} delete document #{1}', {replace: ['Mark', '42']})
logger.error('error when user {0} delete document #{1}', {replace: ['Mark', '42'], traces: new Error('some error')})
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
<dt><a href="#constructor_options">constructor_options</a></dt>
<dd><p>logger options</p>
</dd>
<dt><a href="#message_options">message_options</a></dt>
<dd><p>message options</p>
</dd>
<dt><a href="#callback_error">callback_error</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="App"></a>

## App
**Kind**: global class  

* [App](#App)
    * [new App(path, [options])](#new_App_new)
    * [._env](#App+_env) : <code>\_partial.type\_env</code>
    * [.get_path()](#App+get_path) ⇒ <code>string</code>
    * [.set_option_days_life(days_life)](#App+set_option_days_life)
    * [.set_option_write_to_console(write_to_console)](#App+set_option_write_to_console)
    * [.set_option_level(level)](#App+set_option_level)
    * [.trace(message, [options])](#App+trace)
    * [.debug(message, [options])](#App+debug)
    * [.error(message, [options])](#App+error)
    * [.save_to_file_force([callback])](#App+save_to_file_force)

<a name="new_App_new"></a>

### new App(path, [options])

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | where store log files, default = __dirname |
| [options] | [<code>constructor\_options</code>](#constructor_options) | additional options |

<a name="App+_env"></a>

### app.\_env : <code>\_partial.type\_env</code>
**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+get_path"></a>

### app.get\_path() ⇒ <code>string</code>
**Kind**: instance method of [<code>App</code>](#App)  
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

### app.trace(message, [options])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| [options] | [<code>message\_options</code>](#message_options) | 

<a name="App+debug"></a>

### app.debug(message, [options])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| [options] | [<code>message\_options</code>](#message_options) | 

<a name="App+error"></a>

### app.error(message, [options])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| message | <code>string</code> \| <code>Error</code> | 
| [options] | [<code>message\_options</code>](#message_options) | 

<a name="App+save_to_file_force"></a>

### app.save\_to\_file\_force([callback])
**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| [callback] | [<code>callback\_error</code>](#callback_error) | 

<a name="type_log_level"></a>

## type\_log\_level : <code>&#x27;trace&#x27;</code> \| <code>&#x27;debug&#x27;</code> \| <code>&#x27;error&#x27;</code>
logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'

**Kind**: global typedef  
<a name="constructor_options"></a>

## constructor\_options
logger options

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [file_name_mask] | <code>string</code> | mask file name for store logger, default = 'app_${yyyymmdd}.log', where '${yyyymmdd}' - date write log. if mask without '${yyyymmdd}', delete old log files not working |
| [days_life] | <code>number</code> | number of days for which log files will be stored, default = 4, only current date = 1, disable delete old log files = 0. you can change it in an already created class in method set_option_days_life |
| [write_to_console] | <code>boolean</code> | write log to file and console (true) or in file only (false), default = true. you can change it in an already created class in method set_option_write_to_console |
| level | [<code>type\_log\_level</code>](#type_log_level) | logger level, default = 'debug'. if = 'trace', log work with ['trace','debug','error'], if = 'debug' - ['debug','error'], if 'error' - only 'error'. you can change it in an already created class in method set_option_level |

<a name="message_options"></a>

## message\_options
message options

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [replace] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | for example: message = 'step #{0} where {1}', replace = [4, 'i create new file'], text result = 'step #4 where i create new file' |
| [traces] | <code>string</code> \| <code>Error</code> \| <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;Error&gt;</code> | big attachment to message, for example - error with full stack |

<a name="callback_error"></a>

## callback\_error : <code>function</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| error | <code>Error</code> | 

