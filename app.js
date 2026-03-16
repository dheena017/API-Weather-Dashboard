// Initialize the weather dashboard
document.addEventListener('DOMContentLoaded', () => {
    const city = 'London'; // Hardcoded city for Part 1
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API Key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Only fetch if API key is replaced to prevent errors with placeholder
    if (apiKey === 'YOUR_API_KEY_HERE') {
        showError('Please replace "YOUR_API_KEY_HERE" in app.js with a valid OpenWeatherMap API Key.');
        return;
    }

    // Fetch weather data using Axios
    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            
            // Log data for debugging
            console.log('Weather Data:', data);

            // Update DOM elements
            updateWeatherUI(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            if (error.response) {
                showError(`Error: ${error.response.data.message} (${error.response.status})`);
            } else if (error.request) {
                showError('Network error. Please check your connection.');
            } else {
                showError('An unexpected error occurred.');
            }
        });
});

function updateWeatherUI(data) {
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const weatherIcon = document.getElementById('weather-icon');
    const errorMessage = document.getElementById('error-message');

    // Extract data
    const tempValue = Math.round(data.main.temp);
    const descValue = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update elements
    cityName.textContent = data.name;
    temperature.textContent = `${tempValue}°C`;
    description.textContent = descValue.charAt(0).toUpperCase() + descValue.slice(1); // Capitalize first letter
    
    // Set icon src and make visible
    weatherIcon.src = iconUrl;
    weatherIcon.alt = descValue;
    weatherIcon.classList.remove('hidden');

    // Hide error message if previously shown
    errorMessage.classList.add('hidden');
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    const weatherContainer = document.getElementById('weather-container');
    
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherContainer.classList.add('hidden'); // Hide weather info on error
}