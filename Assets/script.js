document.addEventListener("DOMContentLoaded", function () {

    // API key for OpenWeatherMap
    var apiKey = "your-api-key-here";

    // Event listener for search form submit
    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault();
        var city = document.getElementById("search-input").value.trim();
        if (city !== "") {
            // Save search history to local storage
            var history = JSON.parse(localStorage.getItem("history")) || [];
            history.push(city);
            localStorage.setItem("history", JSON.stringify(history));
            // Call API to fetch weather data
            getWeatherData(city);
        }
    });

    // Event listener for search history list items
    document.getElementById("history-list").addEventListener("click", function (event) {
        var city = event.target.textContent;
        getWeatherData(city);
    });

    function getWeatherData(city) {
        // Call API to fetch current weather data
        var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
        var currentWeatherRequest = new XMLHttpRequest();
        currentWeatherRequest.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                // Display current weather data
                document.getElementById("city-name").textContent = response.name;
                document.getElementById("date").textContent = moment().format("MMMM Do YYYY");
                document.getElementById("icon").setAttribute("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
                document.getElementById("temperature").textContent = "Temperature: " + response.main.temp + "°C";
                document.getElementById("humidity").textContent = "Humidity: " + response.main.humidity + "%";
                document.getElementById("wind-speed").textContent = "Wind Speed: " + response.wind.speed + " m/s";
                // Call API to fetch forecast weather data
                var forecastWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;
                var forecastWeatherRequest = new XMLHttpRequest();
                forecastWeatherRequest.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        var response = JSON.parse(this.responseText);
                        // Display forecast weather data
                        var forecast = response.list.filter(function (data) {
                            return data.dt_txt.includes("12:00:00");
                        });
                        var forecastHtml = "";
                        for (var i = 0; i < forecast.length; i++) {
                            var date = moment(forecast[i].dt_txt).format("MMMM Do YYYY");
                            var iconUrl = "http://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + ".png";
                            var temperature = forecast[i].main.temp + "°C";
                            var humidity = forecast[i].main.humidity + "%";
                            var windSpeed = forecast[i].wind.speed + " m/s";
                            var html = `
								<div class="card">
									<div class="card-header">${date}</div>
									<div class="card-body">
										<img src="${iconUrl}" alt="${forecast[i].weather[0].description}">
										<p>${temperature}</p>
										<p>${humidity}</p>
										<p>${windSpeed}</p>
									</div>
								</div>
							`;
                            forecastHtml += html;
                        }
                        document.getElementById("forecast").innerHTML = forecastHtml;
                    }
                }
                forecastWeatherRequest.open("GET", forecastWeatherUrl);
                forecastWeatherRequest.send();
            };
            forecastWeatherRequest.open("GET", forecastWeatherUrl);
            forecastWeatherRequest.send();
        }
    };
    currentWeatherRequest.open("GET", currentWeatherUrl);
    currentWeatherRequest.send();
}
                
                css
                Copy code
                // Display search history from local storage
                var history = JSON.parse(localStorage.getItem("history")) || [];
var historyHtml = "";
for (var i = 0; i < history.length; i++) {
    var html = `<li class="list-group-item">${history[i]}</li>`;
    historyHtml += html;
}
document.getElementById("history-list").innerHTML = historyHtml;
                );