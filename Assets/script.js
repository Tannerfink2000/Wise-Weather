const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const cityNameEl = document.querySelector('#city-name');
const dateEl = document.querySelector('#date');
const iconEl = document.querySelector('#icon');
const temperatureEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const forecastCardsEl = document.querySelector('#forecast-cards');
const historyListEl = document.querySelector('#history-list');

function fetchWeatherData(city) {
    // Replace YOUR_API_KEY with your own API key from OpenWeatherMap
    const apiKey = '669e3a10cfa7951d721ca903c32d5f73';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  
    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  
  searchBtn.addEventListener('click', () => {
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      fetchWeatherData(searchValue)
        .then((weatherData) => {
          updateWeather(weatherData);
          searchHistory.unshift(searchValue);
          displaySearchHistory();
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  });

  function updateWeather(data) {
    displayCurrentWeatherData(data);
    displayForecastData(data);
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchBtn.click();
  });
  
  // An array to store the search history
let searchHistory = [];

// Function to display current weather data
function displayCurrentWeatherData(data) {
    if (!data || !data.name) {
      
      return;
    }
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('temperature').textContent = `${temperature} °C`;
    document.getElementById('description').textContent = description;
    document.getElementById('weather-icon').src = weatherIconUrl;
    console.log(data)
  }
  
// Function to display forecast data
function displayForecastData(data) {
  forecastCardsEl.innerHTML = '';
  const { list } = data;

  // Create a card for each of the next five days
  for (let i = 0; i < 5; i++) {
    const { dt, main, wind, weather } = list[i];
    const date = new Date(dt * 1000);

    const cardEl = document.createElement('div');
    cardEl.classList.add('col', 'card', 'bg-primary', 'text-light', 'p-3', 'mb-3');

    const cardBodyEl = document.createElement('div');
    cardBodyEl.classList.add('card-body');

    const cardTitleEl = document.createElement('h5');
    cardTitleEl.classList.add('card-title');
    cardTitleEl.textContent = date.toLocaleDateString();

    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', `https://openweathermap.org/img/w/${weather[0].icon}.png`);
    iconEl.setAttribute('alt', weather[0].description);

    const tempEl = document.createElement('p');
    tempEl.classList.add('card-text');
    tempEl.textContent = `Temperature: ${main.temp} °C`;

    const humidityEl = document.createElement('p');
    humidityEl.classList.add('card-text');
    humidityEl.textContent = `Humidity: ${main.humidity} %`;

    const windSpeedEl = document.createElement('p');
    windSpeedEl.classList.add('card-text');
    windSpeedEl.textContent = `Wind Speed: ${wind.speed} m/s`;

    cardBodyEl.appendChild(cardTitleEl);
    cardBodyEl.appendChild(iconEl);
    cardBodyEl.appendChild(tempEl);
    cardBodyEl.appendChild(humidityEl);
    cardBodyEl.appendChild(windSpeedEl);
    cardEl.appendChild(cardBodyEl);
    forecastCardsEl.appendChild(cardEl);
  }
}

function displaySearchHistory() {
    // Clear the list element
    historyListEl.innerHTML = '';
  
    // Loop through each city in the search history array
    searchHistory.forEach((city) => {
      // Create a new list item element
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item', 'text-dark', 'border-0');
  
      // Set the text content of the list item to the city name
      liEl.textContent = city;
  
      // Add a click event listener to the list item that will call the fetchWeatherData function with the city name
      liEl.addEventListener('click', () => {
        fetchWeatherData(city)
          .then((weatherData) => {
            // Update the current and forecast weather sections with the new weather data
            updateWeather(weatherData);
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      });
  
      // Append the new list item to the search history list element
      historyListEl.appendChild(liEl);
    });
  }