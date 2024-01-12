const {saveShortUrl, getOriginalUrl, deleteShortUrl, getAllOriginalUrls} = require('./shortUrl');
const { LanguageNotSupportError, CountryNotSupportError, NotExistError } = require('./exception');
const { json_success, json_fail, res_redirect, res_404, res_500, res_language_not_supported, res_already_exist } = require('./response');
const { getAllProductNames } = require('./product');
const { getUrlKey } = require('./urlKey');
const { keyExists } = require('./redis');

async function redirectUrl(shortPath, languageAndCountryCode) {
    try {
        let originalUrl = await getOriginalUrl(shortPath, languageAndCountryCode);
        console.log('originalUrlxxxxx:' + originalUrl);
        return res_redirect(originalUrl);
    } catch (err) {
        console.log('redirectUrl, err:' + err);
        if (err instanceof LanguageNotSupportError || err instanceof CountryNotSupportError) {
            return res_language_not_supported(); 
        } else if (err instanceof NotExistError) {
            return res_404(); 
        } else {
            console.error('redirectUrl, error:' + err);
            return res_500(err.message);
        }
    }
}

async function shortenUrl(productName, shortName, urlMapping) {
    try {
        let res = await saveShortUrl(productName, shortName, urlMapping);
        return res ? json_success('Short url saved successfully') : json_fail('Short url saved failed');
    } catch (err) {
        console.error('saveUrls, error:' + err);
        return json_fail(err);
    }
}

async function deleteUrl(productName, shortName) {
    try {
        let res = await deleteShortUrl(productName, shortName);
        return res ? json_success('Short url deleted successfully') : json_fail('Short url deleted failed');
    } catch (err) {
        console.error('deleteUrls, error:' + err);
        return json_fail(err);
    }
}

async function listAllUrls() {
    try {
        let res = await getAllOriginalUrls();
        return res ? json_success(res) : res_404();
    } catch (err) {
        console.error('listAllUrls, error:' + err);
        return json_fail(err);
    }
}

function listAllProductNames() {
    return getAllProductNames();
}

async function generateUrlKey(productName, customUrlKey) {
    if (customUrlKey) {
        if (await keyExists(productName + '/' + customUrlKey)) {
            return res_already_exist();
        }
        return json_success(customUrlKey);
    }

    let urlKey = await getUrlKey(productName);
    return json_success(urlKey);
}

module.exports = { redirectUrl, shortenUrl, deleteUrl, listAllUrls, listAllProductNames, generateUrlKey };