const https = require('https');
const chalk = require('chalk');

const getCoords = (location, callback) => {
    const mapBoxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1IjoiYXJpZWxiZWhhciIsImEiOiJjazl5bGJ2ZDgwcHQ3M21wa2lsM2tkYXZtIn0.1HzPAPyAOHdFxTOze2MMrA&limit=1`;

    https.get(mapBoxUrl, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode != 200) {
            error = new Error(`Request failed. Status code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType) && !/^application\/vnd.geo\+json/.test(contentType)) {
            error = new Error(`Invalid content type. Expected 'application/json' and instead got ${contentType}`);
        }

        if (error) {
            console.log(chalk.red.inverse(error.message));
        }

        let rawData = '';

        res.on('data', chunk => {
            rawData += chunk;
        })
            .on('end', () => {
                try {
                    let data = JSON.parse(rawData);

                    callback(data);
                } catch (err) {
                    console.log(chalk.red(`The location '${chalk.underline(location)}' could not be found. Please try another one!`));
                }
            })
            .on('error', err => {
                console.log(err.message);
            });
    });
};

module.exports = {
    getCoords,
};
