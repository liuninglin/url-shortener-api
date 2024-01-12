const { checkHashFieldExists, getHashField } = require('./redis');
const { res_redirect, res_404, res_language_not_supported } = require('./response');

// define an array of supported country codes
const supportedCountryCodes = ['US', 'GB', 'FR', 'CA', 'AU'];
const supportedLanguageCodes = ['en', 'fr', ''];

async function redirect(hashKey, languageAndCountryCode = 'FR') {
    try {
        // get countryCode and languageCode from the languageAndCountryCode
        // if no '-' inside, set it to 'US'
        let countryCode = languageAndCountryCode.indexOf('-') > 0 ? languageAndCountryCode.split('-')[1] : languageAndCountryCode;
        let languageCode = languageAndCountryCode.indexOf('-') > 0 ? languageAndCountryCode.split('-')[0] : '';
        
        // check if countryCode is supported
        if (!supportedCountryCodes.includes(countryCode) || !supportedLanguageCodes.includes(languageCode)) {
            return res_language_not_supported();
        }

        let res = await checkHashFieldExists(hashKey, languageAndCountryCode);
        if (res) {
            let originalUrl = await getHashField(hashKey, languageAndCountryCode);
            console.info('redirect to: ' + originalUrl);
            return res_redirect(originalUrl);
        } else {
            let res = await checkHashFieldExists(hashKey, countryCode);
            if (res) {
                let originalUrl = await getHashField(hashKey, countryCode);
                console.info('redirect to: ' + originalUrl);
                return res_redirect(originalUrl);
            } else {
                return res_404();
            }
        }
    } catch (err) {
        console.error('redirect, error:' + err);
    }
}

module.exports = { redirect };