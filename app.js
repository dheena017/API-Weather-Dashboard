/**
 * WeatherApp Constructor
 * Initializes the application and sets up DOM references
 */
function WeatherApp() {
    this.apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API Key
    this.currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // UI Elements
    this.cityInput = document.getElementById('city-input');
    this.searchBtn = document.getElementById('search-btn');
    this.loadingMessage = document.getElementById('loading-message');
    this.errorMessage = document.getElementById('error-message');
    
    // Current Weather Elements
    this.weatherContainer = document.getElementById('weather-container');
    this.cityNameEl = document.getElementById('city-name');
    this.temperatureEl = document.getElementById('temperature');
    this.descriptionEl = document.getElementById('description');
    this.weatherIconEl = document.getElementById('weather-icon');

    // Forecast Elements
    this.forecastSection = document.getElementById('forecast-section');
    this.forecastContainer = document.getElementById('forecast-container');
}

/**
 * Initialize the application
 * Sets up event listeners
 */
WeatherApp.prototype.init = function() {
    // Check API Key
    if (this.apiKey === 'YOUR_API_KEY_HERE') {
        this.showError('Please replace "YOUR_API_KEY_HERE" in app.js with a valid OpenWeatherMap API Key.');
    }

    // Event Listeners
    // Using .bind(this) to ensure 'this' refers to the WeatherApp instance inside the callback
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    
    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    });
};

/**
 * Handle Search Event
 */
WeatherApp.prototype.handleSearch = function() {
    const city = this.cityInput.value.trim();
    if (city) {
        this.fetchWeatherData(city);
    } else {
        this.showError('Please enter a city name.');
    }
};

/**
 * Fetch Weather Data (Current & Forecast)
 * Uses Promise.all to fetch both endpoints simultaneously
 */
WeatherApp.prototype.fetchWeatherData = async function(city) {
    this.showLoading();

    try {
        const commonParams = `?q=${city}&appid=${this.apiKey}&units=metric`;
        
        // Fetch both APIs in parallel
        const [currentStats, forecastStats] = await Promise.all([
            axios.get(this.currentWeatherUrl + commonParams),
            axios.get(this.forecastUrl + commonParams)
        ]);

        console.log('Current Weather:', currentStats.data);
        console.log('Forecast:', forecastStats.data);

        // Process and Display Data
        this.displayCurrentWeather(currentStats.data);
        this.displayForecast(forecastStats.data);
        
        this.hideLoading();

    } catch (error) {
        console.error('Error fetching data:', error);
        this.handleError(error);
        this.hideLoading();
    }
};

/**
 * Display Current Weather
 */
WeatherApp.prototype.displayCurrentWeather = function(data) {
    const tempValue = Math.round(data.main.temp);
    const descValue = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    this.cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    this.temperatureEl.textContent = `${tempValue}°C`;
    this.descriptionEl.textContent = descValue.charAt(0).toUpperCase() + descValue.slice(1);
    
    this.weatherIconEl.src = iconUrl;
    this.weatherIconEl.alt = descValue;
    this.weatherIconEl.classList.remove('hidden');

    this.weatherContainer.classList.remove('hidden');
    this.errorMessage.classList.add('hidden');
};

/**
 * Display 5-Day Forecast
 */
WeatherApp.prototype.displayForecast = function(data) {
    this.forecastContainer.innerHTML = ''; // Clear previous forecast

    // Filter to get one reading per day (around 12:00 PM)
    // The API returns 3-hour intervals.
    const dailyData = data.list.filter(reading => reading.dt_txt.includes('12:00:00'));

    // If we get fewer than 5 days due to timing (late in the day), 
    // we might want to just take every 8th item as a fallback, 
    // but the 12:00 strategy is standard for this assignment level.
    
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create Forecast Card
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <span class="forecast-day">${date}</span>
            <img src="${iconUrl}" alt="${desc}" class="forecast-icon">
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${desc}</div>
        `;

        this.forecastContainer.appendChild(card);
    });

    this.forecastSection.classList.remove('hidden');
};

/**
 * Handle Errors
 */
WeatherApp.prototype.handleError = function(error) {
    // Hide weather data on error
    this.weatherContainer.classList.add('hidden');
    this.forecastSection.classList.add('hidden');
    this.errorMessage.classList.remove('hidden');
    
    if (error.response) {
        if (error.response.status === 404) {
            this.errorMessage.textContent = 'City not found. Please check the spelling.';
        } else {
            this.errorMessage.textContent = `Error: ${error.response.data.message} (${error.response.status})`;
        }
    } else if (error.request) {
        this.errorMessage.textContent = 'Network error. Please check your connection.';
    } else {
        this.errorMessage.textContent = 'An unexpected error occurred.';
    }
};

/**
 * Show Loading State
 */
WeatherApp.prototype.showLoading = function() {
    this.loadingMessage.classList.remove('hidden');
    this.weatherContainer.classList.add('hidden');
    this.forecastSection.classList.add('hidden');
    this.errorMessage.classList.add('hidden');
};

/**
 * Hide Loading State
 */
WeatherApp.prototype.hideLoading = function() {
    this.loadingMessage.classList.add('hidden');
};

/**
 * Show Error Message Helper
 */
WeatherApp.prototype.showError = function(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.remove('hidden');
    this.weatherContainer.classList.add('hidden');
    this.forecastSection.classList.add('hidden');
};

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
    app.init();
});