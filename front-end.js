var movieCollection = require('app/collection/movie');
var movieView = require('app/view/movie');

window.movies = new movieCollection();
movies.on( 'add', function(model) {
	var view = new movieView({ model: model});
	document.body.appendChild(view.el);
	view.render();
});
movies.fetch();