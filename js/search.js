/*
	Interactive APIs

	Now that we know how to make a call to an API and process the response, we 
	can make the process interactive by using forms!
*/


// _____________________________________________________________________________
// CACHING DOM ELEMENTS

// Search form
var dataForm = document.getElementById("movie-form");
var movieNameInput = dataForm.elements["movie-name"];
movieNameInput.focus(); // Give the search bar focus when the page loads
// Wrappers
var searchResultsDiv = document.getElementById("search-results");

// Get HTML template from DOM
var movieTemplate = $("#movie-template").html();



// _____________________________________________________________________________
// SETUP

// Set up the movie searh API request information
var movieEndpoint = "http://api.themoviedb.org/3/search/movie";
var movieParameters = { 
	api_key: "90310868ad519e2d04de29e0873f434b",
	movie: "",
	page: "1"
}

// Global variable to hold onto the search results
var searchResults;


// _____________________________________________________________________________
// SEARCH FORM API REQUEST

dataForm.onsubmit = function (event) {
	event.preventDefault(); // Hey browser-dude, don't refresh the page onsubmit
	
	// Validate input
	var movieName = movieNameInput.value;
	if (movieName === "") return false;

	// Call API
	movieParameters.query = movieName; // Modify only one parameter
	var movieSearchCaller = new ApiCaller(movieEndpoint, movieParameters);
	movieSearchCaller.getJson(displayMovieData);
}

function displayMovieData(jsonMovie) {
	// console.log(jsonMovie)
	searchResultsDiv.innerHTML = ""; // Clear previous search results
	var movies = jsonMovie.results;
	searchResults = movies; // Store the searchResults globally for use later

	// build custom object to hold data for the template
	var movieData = [];

	for (var i = 0; i < movies.length; i += 1) {
		var movie = movies[i];
		var movieObj = {
			title: movie.title,
			releaseDate: movie.release_date,
			plot: movie.overview,
			imgUrl: ""
		}
		if (movie.poster_path) {
			var base = "http://image.tmdb.org/t/p/";
			var posterSize = "w154";
			var url = base + posterSize + movie.poster_path;
			movieObj.imgUrl = url;
		}	
		movieData.push(movieObj);
	}


	// Compile template and add to DOM
	var theTemplate = Handlebars.compile(movieTemplate);
	$("#search-results").append(theTemplate(movieData));


}
