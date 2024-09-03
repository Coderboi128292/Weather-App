const cityDataInput = document.querySelector(".city-data-input");
const searchButton = document.querySelector(".search-button");
const currentLocationButton = document.querySelector(".current-location-button");
const currentWeatherData = document.querySelector(".current-weather-data");
const weatherForecastCards = document.querySelector(".weather-forecast-cards");
const recentCitiesDropdown = document.createElement("select"); // Create the dropdown
const API_KEY = "a8157f1fa35ec0e624c2395263e0b0f8"; // API key for OpenWeatherMap API

// Function to create the weather card HTML
const createWeatherCard = (cityName, weatherDataItem, index) => {
    
    if (index === 0) {
        // HTML structure for the main weather card section
        return `<div class="weather-details ">
                <h1 class="text-lg font-extrabold">${cityName} (${weatherDataItem.dt_txt.split(" ")[0]})</h1>
                <h2 class="text-2x font-bold xl:text-lg">Temp: ${(weatherDataItem.main.temp - 273.15).toFixed(2)} °C</h2>
                <h2 class="text-2x font-bold xl:text-lg">Wind: ${weatherDataItem.wind.speed} M/S</h2>
                <h2 class="text-2x font-bold xl:text-lg">Humidity: ${weatherDataItem.main.humidity}%</h2>
            </div>
            <div class="weather-image">
                <img src="https://openweathermap.org/img/wn/${weatherDataItem.weather[0].icon}@2x.png" alt="weather-image">
                <h2 class="text-lg font-extrabold">${weatherDataItem.weather[0].description}</h2>
            </div>`;
    } else {
        // HTML structure for the other five-days weather forecast cards
        return `<li class="card text-white p-5 list-none w-52 xl:w-52 bg-blue-600 rounded">
                <h1 class="text-xl font-semibold">${weatherDataItem.dt_txt.split(" ")[0]}</h1>
                <img src="https://openweathermap.org/img/wn/${weatherDataItem.weather[0].icon}@2x.png" alt="weather-image">
                <h2 class="mt-2 font-medium">Temp: ${(weatherDataItem.main.temp - 273.15).toFixed(2)} °C</h2>
                <h2 class="font-medium">Wind: ${weatherDataItem.wind.speed} M/S</h2>
                <h2 class="font-medium">Humidity: ${weatherDataItem.main.humidity}%</h2>
            </li>`;
    }
};

// Function to validate city name using OpenWeatherMap's Geocoding API
const validateCity = (cityName) => {
    const GEO_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    return fetch(GEO_API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0 && data[0].local_names && data[0].name.toLowerCase() === cityName.toLowerCase() && data[0].country) {
                return data[0].name;
            } else {
                throw new Error("City not found");
            }
        });
};