// Initialize the weather dashboard
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherContainer = document.getElementById('weather-container');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');
    const weatherIcon = document.getElementById('weather-icon');
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');

    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API Key

    // Search button click event
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            showError('Please enter a city name.');
        }
    });

    // Enter key event
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
            } else {
                showError('Please enter a city name.');
            }
        }
    });

    // Check if API key is set
    if (apiKey === 'YOUR_API_KEY_HERE') {
        showError('Please replace "YOUR_API_KEY_HERE" in app.js with a valid OpenWeatherMap API Key.');
    }

    // Async function to fetch weather data
    async function fetchWeather(city) {
        showLoading();
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;
            
            console.log('Weather Data:', data);
            updateWeatherUI(data);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    showError('City not found. Please check the spelling.');
                } else {
                    showError(`Error: ${error.response.data.message} (${error.response.status})`);
                }
            } else if (error.request) {
                showError('Network error. Please check your connection.');
            } else {
                showError('An unexpected error occurred.');
            }
        } finally {
            hideLoading();
        }
    }

    function updateWeatherUI(data) {
        const tempValue = Math.round(data.main.temp);
        const descValue = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        cityName.textContent = data.name;
        temperature.textContent = `${tempValue}°C`;
        description.textContent = descValue.charAt(0).toUpperCase() + descValue.slice(1);
        
        weatherIcon.src = iconUrl;
        weatherIcon.alt = descValue;
        weatherIcon.classList.remove('hidden');

        weatherContainer.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    }

    function showLoading() {
        loadingMessage.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    function hideLoading() {
        loadingMessage.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
    }
});