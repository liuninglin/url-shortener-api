class LanguageNotSupportError extends Error {
    constructor(args){
        super(args);
        this.name = "FancyError"
    }
}

class CountryNotSupportError extends Error {
    constructor(args){
        super(args);
        this.name = "CountryNotSupportError"
    }
}

class NotExistError extends Error {
    constructor(args){
        super(args);
        this.name = "NotExistError"
    }
}

module.exports = { LanguageNotSupportError, CountryNotSupportError, NotExistError };