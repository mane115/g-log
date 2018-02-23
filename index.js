const log4js = require('log4js');
const fs = require('fs');
const saveMkdir = dir => {
    try {
        fs.mkdirSync(dir);
    } finally {
        return null;
    }
};
class Log {
    constructor(
        {
            isErrorLog = true,
            isWarnLog = true,
            isStdout = true,
            defaultLogType = 'dateFile',
            defaultPattern = '-yyyy-MM-dd.log',
            defaultLogLevel = '',
            alwaysIncludePattern = true,
            logCategories = [],
            env = 'development',
            logDir = 'logs',
        }
    ) {
        this.logger = {};
        if (logDir) {
            saveMkdir(logDir);
        }
        let logLevel = env === 'development' ? 'all' : 'info';
        let config = {
            appenders: {
                other: {
                    type: 'file', filename: `${logDir}/other.log`
                },
                console: {
                    type: 'console'
                },
                out: {
                    type: 'stdout'
                }
            },
            categories: {
                default: {
                    appenders: ['other'],
                    level: 'debug'
                }
            },
        };
        if (isWarnLog) {
            config.appenders._warnAppender = {
                type: 'file',
                filename: `${logDir}/warn.log`
            };
            config.appenders.warn = {
                type: 'logLevelFilter',
                level: 'WARN',
                maxLevel: 'WARN',
                appender: '_warnAppender'
            };
            config.categories.default.appenders.push('warn');
        }
        if (isErrorLog) {
            config.appenders._errorAppender = {
                type: 'file',
                filename: `${logDir}/error.log`
            };
            config.appenders.error = {
                type: 'logLevelFilter',
                level: 'ERROR',
                maxLevel: 'ERROR',
                appender: '_errorAppender'
            };
            config.categories.default.appenders.push('error');
        }

        if (logCategories.length) {
            logCategories.forEach(category => {
                config.appenders[category] = {
                    type: defaultLogType,
                    pattern: defaultPattern,
                    alwaysIncludePattern,
                    filename: `${logDir}/${category}`
                };
                config.categories[category] = {
                    appenders: [category],
                    level: logLevel
                };
                if (isErrorLog) {
                    config.categories[category].appenders.push('error');
                }
                if (isWarnLog) {
                    config.categories[category].appenders.push('warn');
                }
                if (isStdout) {
                    config.categories[category].appenders.push('out');
                }
            });
        }
        log4js.configure(config);
        if (logCategories.length) {
            logCategories.forEach(category => {
                this.logger[category] = log4js.getLogger(category);
                this.logger[category].level = logLevel;
            });
        }
    }

    getLogMidware({type = 'koa2', category}) {
        let mid;
        let self = this;
        let logger = self.logger[category];
        switch (type) {
            case 'koa1':
                mid = function * (next) {
                    this.logger = logger;
                    yield next;
                };
                break;
            case 'express':
                mid = function(req, res, next) {
                    req.logger = logger;
                    next();
                };
                break;
            case 'koa2':
            case 'koa':
            default:
                mid = async function(ctx, next) {
                    ctx.logger = logger;
                    await next();
                };
                break;
        }
        return mid;
    }
    getLogger(category) {
        return this.logger[category];
    }
}
module.exporta = Log;

let log = new Log({
    logCategories: ['test', 'g']
});

// let logger = log.getLogger('test');
// let logger = log.logger.test;
let logger = log4js.getLogger('test');
logger.info('test32131');
logger.error('test32131');
