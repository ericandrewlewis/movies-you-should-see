var express = require('express'),
	app = express(),
	http = require('http'),
	MongoClient = require('mongodb').MongoClient,
	_ = require('lodash'),
	assert = require('assert'),
	sprintf = require('sprintf');
	Backbone = require('backbone'),
	apiKey = 'b24ecadd649a7322bf03a37e4546aa9f',
	TMDBAPIendpoints = {
		upcoming: sprintf('http://api.themoviedb.org/3/movie/upcoming?api_key=%s', apiKey),
		movieCredits: sprintf('http://api.themoviedb.org/3/movie/{id}/credits?api_key=%s', apiKey),
		configuration: sprintf('http://api.themoviedb.org/3/configuration?api_key=%s', apiKey)
	};

app.set('view engine', 'html');
app.set('views', __dirname + '/node_modules/app/templates');
app.engine( 'html', require( 'hogan-express' ) );

/**
 * Initialize the connection to the Mongodb daemon.
 *
 * @fires `mongodb:connected` on the application.
 */
var openDBConnection = function() {
	var url = 'mongodb://localhost:27017/myproject';
	MongoClient.connect(url, function (err, mongoDB) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
		application.set( 'db', mongoDB );
		application.trigger('mongodb:connected');
	});
}

/**
 * Fetch upcoming movies from the TMDB API and store them in mongo.
 */
var updateUpcomingMoviesFromAPI = function (options) {
	var collection = application.get( 'db' ).collection('movies'),
		endpoint = TMDBAPIendpoints.upcoming;

	options = options || {};
	options = _.defaults( options, { page: 1 } )
	options.page = _.parseInt( options.page );

	if ( options.page != 1 ) {
		endpoint = endpoint + '&page=' + options.page;
	}
	http.get( endpoint, function(response) {
		var body = '';
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function () {
			var bodyJSON = JSON.parse( body ),
				collection = application.get( 'db' ).collection('movies');

			console.log( sprintf( 'Getting results from page %d', bodyJSON.page ) );

			// On the first request, kick off requests
			// to fetch all paginated results.
			if ( bodyJSON.page === 1 && bodyJSON.total_pages > 1 ) {
				var pageRunner = 2;
				for ( var pageRunner = 2; pageRunner <= bodyJSON.total_pages; pageRunner++ ) {
					updateUpcomingMoviesFromAPI( { page: pageRunner } );
				}
			}

			_.forEach( bodyJSON.results, function(movie) {
				movie._id = movie.id;
				collection.save(movie, function (err, result) {
					assert.equal(err, null);
				});
			});

		});
	});
};

/**
 * For all movies in the db, query the API for credits and update the entry.
 *
 * @return {[type]} [description]
 */
var updateAllMovieCreditsFromAPI = function() {
	movies = getMovies();
	movies.toArray(function(err, movies) {
		var wait = 0;
		_.forEach( movies, function(movie, index, movies) {
			_.delay( updateMovieCreditFromAPI, wait, movie );
			wait += 300;
		});
	});
};

/**
 * Update a movie's credit by requesting data from the API.
 *
 * @param  {object} movie A movie object.
 * @return {[type]}       [description]
 */
var updateMovieCreditFromAPI = function( movie ) {
	var endpoint = TMDBAPIendpoints.movieCredits.replace( '{id}', movie._id );
	http.get( endpoint, function(response) {
		var body = '';
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function () {
			var bodyJSON = JSON.parse( body ),
				collection = application.get( 'db' ).collection('movies');
			if ( bodyJSON.cast ) {
				movie.cast = bodyJSON.cast;
			}
			if ( bodyJSON.crew ) {
				movie.crew = bodyJSON.crew;
			}

			console.log( sprintf( 'Updating credits for %s', movie.title ) );
			collection.save(movie, function (err, result) {
				assert.equal(err, null);
			});
		});
	});
};

/**
 * Close the db connection.
 *
 * @return {[type]} [description]
 */
var closeDBConnection = function() {
	var db = application.get('db');
	application.off('mongodb:connected');
	if ( ! db ) {
		return;
	}
	db.close();
};

/**
 * Output all the movies in the db.
 *
 * @return {[type]} [description]
 */
var getMovies = function () {
	var collection = application.get('db').collection('movies');
	return collection.find({});
};

/**
 * Get configuration info to build image URLs.
 *
 * @return {[type]} [description]
 */
var getTMDBConfigInfo = function () {
	var collection = application.get('db').collection('config');
	return collection.find({});
};

var application = new Backbone.Model();

application.on( 'shutdown', closeDBConnection );

app.use( '/application', express.static( './application' ) );
app.use( '/static', express.static( './static' ) );
app.use( '/bundle.js', express.static( './bundle.js' ) );

app.get('/index', function (request, response) {
	console.log( '/index route' );
	application.on('mongodb:connected', function() {
		var movies = getTMDBConfigInfo();
		movies.toArray(function(err, config) {
			application.trigger('shutdown');
			response.render( 'page', { movieConfig: JSON.stringify(config[0]) } );
		});
	} );
	openDBConnection();
});

/**
 * JSON endpoint for all movies.
 *
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
app.get('/movies', function (request, response) {
	console.log( '/movies route' );
	application.on('mongodb:connected', function() {
		var movies = getMovies();
		movies.toArray(function(err, movies) {
			application.trigger('shutdown');
			response.end( JSON.stringify(movies) );
		});
	} );
	openDBConnection();
});

/**
 * Update movies endpoint.
 *
 * Queries the TMDB API for upcoming movies and updates the db.
 *
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
app.get( '/updatemovies', function (request, response) {
	console.log( '/updatemovies route' );
	application.on( 'mongodb:connected', updateUpcomingMoviesFromAPI );
	openDBConnection();
	response.end('Updated I guess!');
});

/**
 * Update movie credits endpoint.
 *
 * Queries the TMDB API for each movie's credits and updates the db.
 *
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
app.get( '/updatemoviecredits', function (request, response) {
	console.log( '/updatemoviecredits route' );
	application.on('mongodb:connected', updateAllMovieCreditsFromAPI );
	openDBConnection();
	response.end('Updated I guess!');
});

/**
 * Endpoint handler for updating the image API config info.
 *
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
app.get( '/updateapiimageconfig', function (request, response) {
	console.log( '/updateAPIConfig route' );
	application.on('mongodb:connected', updateAPIConfig );
	openDBConnection();
	response.end('Updated image config.');
});

/**
 * Update the image API config info.
 *
 * @return {[type]} [description]
 */
var updateAPIConfig = function() {
	var endpoint = TMDBAPIendpoints.configuration;
	http.get( endpoint, function(response) {
		var body = '';
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function () {
			var config = JSON.parse( body ),
				collection = application.get( 'db' ).collection('config');
			config._id = 'singleton';
			console.log('Updating API config');
			collection.save(config, function (err, result) {
				assert.equal(err, null);
			});
		});
	});
};

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});