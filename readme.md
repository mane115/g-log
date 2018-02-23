# g-log

a log class

- ### constructor

  option `Object` class config option

  option.isErrorLog `Boolean` is save error log, if `true`, when use logger.error('sth error') will write a log record in `${logDir}/error.log`, default true

  option.isWarnLog `Boolean` is save warn log, if `true`, when use logger.warn('sth warn') will write a log record in `${logDir}/warn.log`, default true

  option.isStdout `Boolean` is str output stream, default true

  option.isPrd `Boolean` is production environment,if `true` all the log level is `info`, else level is `all`, default false

  option.defaultLogType `String` default log4js appenders type, default is dateFile

  option.defaultPattern `String` if defaultLogType is `dateFile`, this option is effective, default is -yyyy-MM-dd.log

  option.alwaysIncludePattern `Boolean` if defaultLogType is `dateFile`, this option is effective, default is true

  option.logCategories `Array`, difference categories logger , **require**

  option.logDir `String` if defaultLogType is `dateFile` or `file`, this option is effective, a dir string save the log files, default is logs

- ### api

  - ##### getLogMidware

    category `String` which category logger the midware is

    type `String` a string indicate return which frame midware, support `koa,koa2,koa1,express`,(koa = koa2) default `koa`

    return a midware function

- ##### getLogger

  category `String` which category logger is

- ### usage

  ```javascript
    // init
    const Log = require('g-log');
    const log = new Log({
      logCategories:['user', 'order']
    });
    const logMidware = log.getLogMidware('user') //koa
    app.use(logMidware);
    
    // business
    const logger = log.getLogger('user');
    logger.info('log here'); // [2018-02-23T16:47:20.748] [INFO] user - log here

    // business midware
    app.use(async function(ctx,next) {
      ctx.logger.info('log here')// [2018-02-23T16:47:20.748] [INFO] user - log here
    })
  ```
