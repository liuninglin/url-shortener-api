const fs = require('fs');
const path = require('path');

function home() {
    const filePath = path.join(__dirname, '../static', 'index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: html
    };
};

module.exports = { home };