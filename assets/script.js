// gloal variabbles
const apiKey = "d796956f54749e84c8e319e0e5b6141b";
let prevSearches = [];


let currentWeather = function(cityName) {
    // using data for open weather weather api (String Interpolation on url)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        // get response and turn it into objects
        .then((response) => {return response.json();
        })
        .then(function(response) {
            // get's cities coordinates
            let cityLon = response.coord.lon;
            let cityLat = response.coord.lat;

            fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`) 
                // get response from one call api and turn it into objects
                .then((response) => {return response.json();
                //.then(function(response) {return response.json();
                })
                // get data from response and apply them to the current weather section
                 .then((response) => {searchHistoryList(cityName);
         
        
                    // add current weathe container city name, date, and weather icon to current weather section title
                    let currentWeatherContainer = $("#current-weather-container");
                    let currentTitle = $("#current-title");
                    let currentDay = moment().format("MMMM Do YYYY");
                    let currentIcon = $("#current-weather-icon");
                    let currentIconCode = response.current.weather[0].icon;

                    currentWeatherContainer.addClass("current-weather-container");
                    currentTitle.text(`${cityName} (${currentDay})`);
                    currentIcon.addClass("current-weather-icon");
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);
                    
                    
                    let currentTemperature = $("#current-temperature");
                    let currentHumidity = $("#current-humidity");
                    let currentWindSpeed = $("#current-wind-speed");
                    let currentUvIndex = $("#current-uv-index");
                    let currentNumber = $("#current-number");

                    currentTemperature.text("Temperature: " + response.current.temp + " \u00B0F");
                    currentHumidity.text("Humidity: " + response.current.humidity + "%");
                    currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");
                    currentUvIndex.text("UV Index: ");
                    currentNumber.text(response.current.uvi);

                })
        })

       
};



let fiveDayForecast = function(cityName) {
    // get and use data from open weather current weather api end point
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        // get response and turn it into objects
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get city's longitude and latitude
            let cityLon = response.coord.lon;
            let cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // get response from one call api and turn it into objects
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    // add 5 day forecast title
                    let futureForecastTitle = $("#future-forecast-heading");
                    futureForecastTitle.text("5-Day Forecast:")

                    // using data from response, set up each day of 5 day forecast
                    for (let i = 1; i <= 5; i++) {
                        // add class to future cards to create card containers
                        let futureCard = $(".future-forecastcard");
                        futureCard.addClass("future-card-details");

                        // add date to 5 day forecast
                        let futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);

                        // add icon to 5 day forecast
                        let futureIcon = $("#future-icon-" + i);
                        futureIcon.addClass("future-icon");
                        let futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        // add temp to 5 day forecast
                        let futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        // add humidity to 5 day forecast
                        let futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};

// called when the search form is submitted

$("#search-form").on("submit", function() {
    event.preventDefault();
    
    // get name of city searched
    let cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
    } else {
        // if cityName is valid, add it to search history list and display its weather conditions
        currentWeather(cityName);
        fiveDayForecast(cityName);
    }
});


// called when a search history entry is clicked
$("#search-history-container").on("click", "p", function() {
    // get text (city name) of entry and pass it as a parameter to display weather conditions
    let previousCityName = $(this).text();
    currentWeather(previousCityName);
    fiveDayForecast(previousCityName);

    //
    let previousCityClicked = $(this);
    previousCityClicked.remove();
});




// make list of previously searched cities
const searchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    // create entry with city name
    let searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // create container for entry
    let searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    // append entry to container
    searchEntryContainer.append(searchHistoryEntry);

    // append entry container to search history container
    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (prevSearches.length > 0){
        // update savedSearches array with previously saved searches
        var prevSavedSearches = localStorage.getItem("prevSearches");
        prevSearches = JSON.parse(prevSavedSearches);
    }

    // add city name to array of saved searches
    prevSearches.push(cityName);
    localStorage.setItem("prevSearches", JSON.stringify(prevSearches));

    // reset search input
    $("#search-input").val("");

};

// load saved search history entries into search history container
var loadSearchHistory = function() {
    // get saved search history
    var savedSearchHistory = localStorage.getItem("prevSearches");

    // return false if there is no previous saved searches
    if (!savedSearchHistory) {
        return false;
    }

    // turn saved search history string into array
    savedSearchHistory = JSON.parse(savedSearchHistory);

    // go through savedSearchHistory array and make entry for each item in the list
    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};

loadSearchHistory();
