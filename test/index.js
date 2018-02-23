const assert = require('assert');
const Koa = require('koa');
const express = require('express');
const http = require('http');
const Log = require('../');
const log = new Log({
    logCategories: ['koa', 'express']
});
describe('test express mid', function() {
    const app = express();
    app.use(log.getLogMidware('express', 'express'));
    app.use(function(req, res, next) {
        req.logger.info('test from express mid');
        res.send('success');
    });
    app.listen(30002);
    it('response should be success', function() {
        http.get('http://localhost:30002', res => {
            let data = '';
            res.on('data', _data => data += _data);
            res.on('end', () => {
                assert.equal(data, 'success');
            });
        });
    });
});

describe('test koa mid', function() {
    const app = new Koa();
    app.use(log.getLogMidware('koa'));
    app.use(async function(ctx, next) {
        ctx.logger.info('test from koa mid');
        ctx.body = 'success';
    });
    app.listen(30001);
    it('response should be success', function() {
        http.get('http://localhost:30001', res => {
            let data = '';
            res.on('data', _data => data += _data);
            res.on('end', () => {
                assert.equal(data, 'success');
            });
        });
    });
});
