Movies You Should See
=====================

Go to movies that you'd be into.

Use [TMDB](https://www.themoviedb.org/)'s [API](https://www.themoviedb.org/documentation/api), we retrieve a list of the [upcoming movies](http://docs.themoviedb.apiary.io/reference/movies/movieupcoming/get) combined with [movie credits](http://docs.themoviedb.apiary.io/reference/movies/movieidcredits/get), and store it all in a mongodb instance.

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
* In another terminal window at the root of the repo, start the web serving application.

	```bash
	node app.js
	```

Now what? [Download movie data from the API](http://localhost:3000/updatemovies), or [view the data you've already downloaded](http://localhost:3000/). More soon.