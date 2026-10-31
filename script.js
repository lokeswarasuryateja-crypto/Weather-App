const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    cityInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
});

async function getWeather(city) {

    document.getElementById("description").textContent = "Loading...";

    try {
        // Step 1: Find city location
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];

        // Step 2: Get weather details
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Display weather
        document.getElementById("cityName").textContent = location.name;

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + "°C";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        // Step 4: Weather condition
        const code = current.weather_code;
        let description = "Unknown";
        let icon = "🌤️";

        if (code === 0) {
            description = "Clear Sky";
            icon = "☀️";
        } else if (code <= 3) {
            description = "Partly Cloudy";
            icon = "🌤️";
        } else if (code <= 48) {
            description = "Foggy";
            icon = "🌫️";
        } else if (code <= 67) {
            description = "Rainy";
            icon = "🌧️";
        } else if (code <= 77) {
            description = "Snowy";
            icon = "❄️";
        } else if (code <= 82) {
            description = "Rain Showers";
            icon = "🌦️";
        } else if (code <= 86) {
            description = "Snow Showers";
            icon = "🌨️";
        } else {
            description = "Thunderstorm";
            icon = "⛈️";
        }

        document.getElementById("description").textContent = description;
        document.querySelector(".weather-icon").textContent = icon;

    } catch (error) {
        alert("Error: " + error.message);
        console.log(error);
    }
}