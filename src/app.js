const express = require('express');
const hbs = require('hbs');
const path = require('path');
const yargs = require('yargs');

const forecast = require('./utils/forecast');
const mapbox = require('./utils/mapbox');

const app = express();
const port = 3000;

const publicDirectoryPath = path.join(__dirname, '../public/');
const viewsPath = path.join(__dirname, '../templates/views/');
const partialsPath = path.join(__dirname, '../templates/partials/');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: `Weather App`,
        name: 'Ariel Behar',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: `Help page`,
        name: 'Ariel Behar',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: `About`,
        name: 'Ariel Behar',
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.location) {
        console.log('You need to enter a location to see the its current weather');
    } else {
        const location = req.query.location;

        mapbox.getCoords(location, objCoords => {
            forecast.getWeather(objCoords.features[0].center[1], objCoords.features[0].center[0], objWeather => {
                res.send({
                    location: objCoords.features[0].place_name,
                    description: objWeather.list[0].weather[0].description,
                    temp: objWeather.list[0].main.temp,
                });
            });
        });
    }
});

// Failed request of pages
app.get('/help/*', (req, res) => {
    res.render('help', {
        title: `Help Article`,
        name: 'Ariel Behar',
    });
});

app.get('/*', (req, res) => {
    res.render('404', {
        title: `404`,
        name: 'Ariel Behar',
    });
});

app.listen(port, (res, err) => {
    if (err) {
        console.log(`My Error: ${err.message}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});

yargs.argv;
