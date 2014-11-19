Movies You Should See
=====================

Get a list of movies in theaters that you'd be into, based on your preferences.

Use [TMDB](https://www.themoviedb.org/)'s [API](https://www.themoviedb.org/documentation/api),
we retrieve a list of the [upcoming movies](http://docs.themoviedb.apiary.io/reference/movies/movieupcoming/get)
combined with [movie credits](http://docs.themoviedb.apiary.io/reference/movies/movieidcredits/get),
and store it all in a mongodb instance.

### Installation

* In a terminal window at the root of the repo, install all node dependencies.

	```bash
	npm install
	```
* Install MongoDB.

	```bash
	brew install mongodb
	```
* Create a folder called `data` at the root of the repo. Mongodb data will be stored there.
* In a terminal window at the root of the repo, start the mongodb daemon.

	```bash
	mongod --dbpath=data --port 27017
	```
* Install browserify, which will be used for compiling JavaScript.

	```bash
	npm install -g browserify
	```
* Compile the front-end JavaScript.

	```bash
	browserify front-end.js -o bundle.js
	```
* In another terminal window at the root of the repo, start the web serving application.

	```bash
	node app.js
	```

Now you have a few endpoints available in your browser.

* [http://localhost:3000/updatemovies](http://localhost:3000/updatemovies) Download generic movie data from the API.
* [http://localhost:3000/updatemoviecredits](http://localhost:3000/updatemovies) Download movie credits data from the API.
* [http://localhost:3000/](http://localhost:3000/) View the data you've already downloaded.