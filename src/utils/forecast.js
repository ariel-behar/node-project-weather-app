const http = require('http');
const chalk = require('chalk');

const getWeather = (lat, lon, callback) => {
    const weatherURL = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=1&units=metric&appid=ac62dab2672f997f6fbc2a14dba13a2a`;

    http.get(weatherURL, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;

        if (statusCode !== 200) {
            error = new Error(`Request failed: status code ${statusCode}`);
        } else if (!/application\/json/.test(contentType)) {
            error = new Error(`Invalid data type: expected application/json and insted got ${contentType}`);
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
                    console.log(err.message);
                }
            })
            .on('error', err => {
                console.log(`An error occurred: ${err.message}`);
            });
    });
};

module.exports = {
    getWeather,
};
