const { saveAllHashFields } = require('./redis');
const { json_fail, json_success } = require('./response');

async function shorten(productName, shortname, urlMapping) {
    try {
        const hashKey = productName + '/' + shortname;

        let res = await saveAllHashFields(hashKey, urlMapping);

        if (res) {
            return json_success('Short URL created successfully.');
        } else {
            return json_fail('Short URL creation failed.');
        } 
    } catch (err) {
        console.error('shorten, error:' + err);
    }
}

module.exports = { shorten };