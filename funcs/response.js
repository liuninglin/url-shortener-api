function json_success(message) {
    let body = {
        success: true,
        message: message
    };
    return {
        statusCode: 200,
        body: JSON.stringify(body),
    };
}

function json_fail(message) {
    let body = {
        success: false,
        message: message
    };
    return {
        statusCode: 200,
        body: JSON.stringify(body),
    };
}

function res_redirect(longUrl) {
    return {
        statusCode: 308,
        headers: {
            Location: longUrl
        }
    };
}

function res_404() {
    return {
        statusCode: 404,
        body: 'Not Found'
    };
}

function res_bad_request() {
    return {
        statusCode: 400,
        body: 'Bad Request'
    };
}

function res_language_not_supported() {
    return {
        statusCode: 400,
        body: 'Language not supported'
    };
}

function res_500(err) {
    return {
        statusCode: 500,
        body: 'Internal Server Error' + err
    };
}

module.exports = { json_success, json_fail, res_redirect, res_404, res_500, res_bad_request, res_language_not_supported };