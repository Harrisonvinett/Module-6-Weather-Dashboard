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
    //use data from open weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        //  response into objects
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get city's long and lat
            let cityLon = response.coord.lon;
            let cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // get response from one call api and turn it into objects
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    
                    let futureForecastTitle = $("#future-forecast-heading");
                    futureForecastTitle.text("5-Day Forecast:");

                    // 5 day forecast
                    for (let i = 1; i <= 5; i++) {
                        
                        let futureCard = $(".future-forecastcard");
                        futureCard.addClass("future-card-details");

                        // date to forecast
                        let futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);

                        // icon to forecast
                        let futureIcon = $("#future-icon-" + i);
                        futureIcon.addClass("future-icon");
                        let futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        //  temp to forecast
                        let futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        //  humidity to forecast
                        let futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};

//  when the search form is submitted

$("#search-form").on("submit", function() {
    event.preventDefault();
    
    //  city name searched
    let cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
    } else {
        // if cityName is valid, add it to search history list and display its weather conditions
        currentWeather(cityName);
        fiveDayForecast(cityName);
    }
});



$("#search-history-container").on("click", "p", function() {
    let previousCityName = $(this).text();
    currentWeather(previousCityName);
    fiveDayForecast(previousCityName);

    //
    let previousCityClicked = $(this);
    previousCityClicked.remove();
});




//  list of previously searched cities
const searchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    let searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    let searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    searchEntryContainer.append(searchHistoryEntry);

    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (prevSearches.length > 0){
        // update savedSearches array with previously saved searches
        var prevSavedSearches = localStorage.getItem("prevSearches");
        prevSearches = JSON.parse(prevSavedSearches);
    }

    prevSearches.push(cityName);
    localStorage.setItem("prevSearches", JSON.stringify(prevSearches));

    // reset search input
    $("#search-input").val("");

};

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
