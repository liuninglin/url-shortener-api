'use strict';

const { home } = require('./funcs/home');
const { redirect } = require('./funcs/redirect');
const { shorten } = require('./funcs/shorten');
const { res_404 } = require('./funcs/response');

module.exports.handler = async (event) => {
    console.info('event json:\n' + JSON.stringify(event));

    let routeKey = event.requestContext.routeKey;

    switch (routeKey) {
        case 'GET /url-shortener':
            return home();
        case 'GET /s/{proxy+}':
            return await redirect(event.pathParameters.proxy, event.headers['accept-language']);
        case 'POST /url-shortener':
            return await shorten('policies', 'def', {
                'US': 'https://www.youtube.com',
                'FR': 'https://www.bilibili.com'
            });
        case 'DELETE /url-shortener':
        case 'PUT /url-shortener':
        case 'GET /url-shortener/all':
        default:
            return res_404();
    }
};
