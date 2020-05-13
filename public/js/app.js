const forecastForm = document.getElementById('forecast');
const userInput = document.getElementById('user-input');

const forecastLocation = document.getElementById('forecast-location');
const forecastTemperature = document.getElementById('forecast-temperature');

forecastForm.addEventListener('click', event => {
    event.preventDefault();

    const location = userInput.value;

    fetch(`/weather?location=${location}`).then(res => {
        res.json().then(data => {
            forecastLocation.textContent = `The current weather in ${data.location} is ${data.description}`;
            forecastTemperature.textContent = `The temperature is ${data.temp}`;
        });
    });
});
