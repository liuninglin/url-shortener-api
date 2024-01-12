'use strict';

const { home } = require('./funcs/home');
const { redirectUrl, shortenUrl, deleteUrl, listAllUrls, listAllProductNames, generateUrlKey } = require('./funcs/action');
const { res_404 } = require('./funcs/response');

module.exports.handler = async (event) => {
    console.info('event json:\n' + JSON.stringify(event));

    let routeKey = event.requestContext.routeKey;
    let productName = 'policies';

    switch (routeKey) {
        case 'GET /url-shortener':
            return home();
        case 'GET /s/{proxy+}':
            return await redirectUrl(event.pathParameters.proxy, event.headers['accept-language']);
        case 'POST /url-shortener':
            return await shortenUrl('policies', 'def', {
                'US': 'https://www.youtube.com',
                'FR': 'https://www.bilibili.com'
            });
        case 'DELETE /url-shortener':
            return await deleteUrl('policies', 'def');
        case 'GET /url-shortener/all':
            return await listAllUrls('policies', 'def');
        case 'GET /product-name/all':
            return listAllProductNames();
        case 'POST /url-key':
            return await generateUrlKey(productName, undefined); 
        default:
            return res_404();
    }
};
