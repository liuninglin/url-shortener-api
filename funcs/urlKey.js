const { customAlphabet } = require('nanoid');
const { keyExists } = require('./redis');

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

async function getUrlKey(productName) {
    const nanoid = customAlphabet(ALPHABET, 8);
    let urlKey = nanoid();
    while ((await keyExists(productName + '/' + urlKey))) {
        urlKey = nanoid()
    }    
    return urlKey;
}

module.exports = { getUrlKey };