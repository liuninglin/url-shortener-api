const { saveHashFields, getHashField, hashFieldExists, getHashFields, deleteHash, getAllKeys } = require('./redis');
const { LanguageNotSupportError, CountryNotSupportError, NotExistError } = require('./exception');
const { getAllProductNames } = require('./product');

const supportedCountryCodes = ['US', 'GB', 'FR', 'CA', 'AU'];
const supportedLanguageCodes = ['en', 'fr', ''];

async function saveShortUrl(productName, shortname, urlMapping) {
    try {
        return await saveHashFields(productName + '/' + shortname, urlMapping);
    } catch (err) {
        console.error('saveShortUrl, error:' + err);
    }
}

async function getOriginalUrl(shortPath, languageAndCountryCode = 'FR') {
    try {
        // get countryCode and languageCode from the languageAndCountryCode
        // if no '-' inside, set it to 'US'
        let countryCode = languageAndCountryCode.indexOf('-') > 0 ? languageAndCountryCode.split('-')[1] : languageAndCountryCode;
        let languageCode = languageAndCountryCode.indexOf('-') > 0 ? languageAndCountryCode.split('-')[0] : '';
        
        // check if countryCode is supported
        if (!supportedCountryCodes.includes(countryCode)) {
            throw new CountryNotSupportError();
        }
        
        // check if languageCode is supported
        if (!supportedLanguageCodes.includes(languageCode)) {
            throw new LanguageNotSupportError();
        }

        let res = await hashFieldExists(shortPath, languageAndCountryCode);
        if (res) {
            return await getHashField(shortPath, languageAndCountryCode);
        } else {
            let res = await hashFieldExists(shortPath, countryCode);
            if (res) {
                return await getHashField(shortPath, countryCode);
            } else {
                throw new NotExistError(); 
            }
        }
    } catch (err) {
        console.error('getOriginalUrl, error:' + err);
        throw err;
    }
}

async function deleteShortUrl(productName, shortName) {
    try {
        let redisHashKey = productName + '/' + shortName;
        return await deleteHash(redisHashKey); 
    } catch (err) {
        console.error('deleteShortUrl, err:' + err);
    }
}

async function getAllOriginalUrls() {
    try {
        const res = [];

        let productNames = getAllProductNames();
        console.log('productNames:' + productNames);
       
        for (let productName of productNames) {
            console.log('productName:' + productName);

            let redisHashKeys = await getAllKeys(productName);
            console.log('redisHashKeys:' + JSON.stringify(redisHashKeys));

            for await (let redisHashKey of redisHashKeys) {
                let redisHashFields = await getHashFields(redisHashKey);
                res.push({ [redisHashKey]: redisHashFields });
            }
        }
        console.log('json res:' + JSON.stringify(res));
        return res;
    } catch (err) {
        console.error('getAllOriginalUrls, err:' + err);
    }
}

module.exports = { saveShortUrl, getOriginalUrl, deleteShortUrl, getAllOriginalUrls }; 