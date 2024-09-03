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

// Function to fetch and display weather details
const getWeatherDetails = (cityName) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") {
                throw new Error("Weather data not found for the specified location.");
            }

            const distinctForecastDays = [];
            const nextFiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!distinctForecastDays.includes(forecastDate)) {
                    distinctForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            // Clear existing weather data
            currentWeatherData.innerHTML = '';
            weatherForecastCards.innerHTML = '';

            // Create and display the main weather card
            const mainWeatherCard = createWeatherCard(cityName, nextFiveDaysForecast[0], 0);
            currentWeatherData.innerHTML = mainWeatherCard;

            // Create and display the 5-day forecast cards
            nextFiveDaysForecast.slice(1).forEach((forecast, index) => {
                const forecastCard = createWeatherCard(cityName, forecast, index + 1);
                weatherForecastCards.innerHTML += forecastCard;
            });

            addCityToDropdown(cityName);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("There was an error fetching the weather data. Please check the city name and try again.");
        });
};

// Function to fetch and display weather details by coordinates
const getWeatherByCoords = (latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") {
                throw new Error("Weather data not found for the specified location.");
            }

            const cityName = data.city.name;
            const distinctForecastDays = [];
            const nextFiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!distinctForecastDays.includes(forecastDate)) {
                    distinctForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            // Clear existing weather data
            currentWeatherData.innerHTML = '';
            weatherForecastCards.innerHTML = '';

            // Create and display the main weather card
            const mainWeatherCard = createWeatherCard(cityName, nextFiveDaysForecast[0], 0);
            currentWeatherData.innerHTML = mainWeatherCard;

            // Create and display the 5-day forecast cards
            nextFiveDaysForecast.slice(1).forEach((forecast, index) => {
                const forecastCard = createWeatherCard(cityName, forecast, index + 1);
                weatherForecastCards.innerHTML += forecastCard;
            });

            addCityToDropdown(cityName);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("There was an error fetching the weather data for your location. Please try again.");
        });
};

// Function to add city to dropdown and store in local storage
const addCityToDropdown = (cityName) => {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    if (!recentCities.includes(cityName)) {
        recentCities.push(cityName);
        localStorage.setItem("recentCities", JSON.stringify(recentCities));
    }
    updateDropdown();
};

// Function to update dropdown menu with recently searched cities
const updateDropdown = () => {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    recentCitiesDropdown.innerHTML = '<option value="">Select a recently searched city</option>';
    recentCities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        recentCitiesDropdown.appendChild(option);
    });

    if (recentCities.length > 0) {
        document.querySelector(".weather-data-input").appendChild(recentCitiesDropdown);
    } else if (recentCitiesDropdown.parentElement) {
        recentCitiesDropdown.parentElement.removeChild(recentCitiesDropdown);
    }
};

// Event listener for the dropdown menu
recentCitiesDropdown.addEventListener("change", () => {
    if (recentCitiesDropdown.value) {
        getWeatherDetails(recentCitiesDropdown.value);
    }
});

// Event listener for the search button
searchButton.addEventListener("click", () => {
    const cityName = cityDataInput.value.trim();
    if (cityName) {
        validateCity(cityName)
            .then(validCityName => {
                getWeatherDetails(validCityName);
            })
            .catch(error => {
                alert("City not found! Please enter a valid city name.");
            });
    } else {
        alert("Please enter a city name.");
    }
});