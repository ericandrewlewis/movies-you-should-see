Movies You Should See
=====================

Go to movies that you'd be into.

Use [TMDB](https://www.themoviedb.org/)'s [API](https://www.themoviedb.org/documentation/api), we retrieve a list of the [upcoming movies](http://docs.themoviedb.apiary.io/reference/movies/movieupcoming/get) combined with [movie credits](http://docs.themoviedb.apiary.io/reference/movies/movieidcredits/get), and store it all in a mongodb instance.

### Installation

* Install all node dependencies.

	`$ npm install`
* Install MongoDB.

	`$ brew install mongodb`
* Create a folder called `data` inside the repo's folder. Mongodb data will be stored there.
* In a terminal window at the root of the repo, start the mongodb daemon.
	`$ mongod --dbpath=data --port 27017`
* In another terminal window at the root of the repo, start the web serving application.