mashApp.models.Movie = Backbone.Model.extend();

mashApp.models.MovieWatcher = Backbone.Model.extend({
    // promptMovieTime: function() {
    //   var movieTime = prompt("Enter (in minutes) the longest amount of time you would sit for a movie:");
    //   this.set({timeLimit: movieTime});
    // },
    // promptFavoriteActors: function() {
    //   var actorString = prompt("Enter a comma separated list(no spaces after ,) of actors you would see in any movie they made.");
    //   var actors = actorString.split(",");
    //   this.set({actors: actors});
    // },
    // promptViewerRatingPreference: function() {
    //   var viewerRating = prompt("Enter the minimum viewer rating (out of 100) a movie must receive for you to see it:");
    //   this.set({viewerRatingLimit: viewerRating});
    // }
});

mashApp.collections.MovieList = Backbone.Collection.extend({
    model: mashApp.models.Movie,
    url: 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=2w6ve7hm5pzqquksaect4d8r',
    sync : function(method, collection, options) {
        options.dataType = "jsonp";
        return Backbone.sync(method, collection, options);
    },

    parse : function(response) {
        return response.movies;
    }
});


mashApp.views.FormView = Backbone.View.extend({

    tagName: 'form',
    className: 'watcher-form',
    template: _.template('<label for="movie-length">Length of longest movie you would sit through: </label><input type="text" name="movie-length"/><input type="checkbox" name="actors" value="Ben Affleck"/>Ben Affleck<input type="checkbox" name="actors" value="Neil Patrick Harris"/>Neil Patrick Harris<button type="button" class="submit-button" name="submit">Submit!</button>'),
    events: {
        'click .submit-button': 'handleSubmit',
        'submit': 'handleSubmit'
    },
    initialize: function() {
        console.log('hi');
        this.render();
    },
    render: function() {
        this.$el.html(this.template());
        $('.form-container').append(this.$el);
    },
    handleSubmit: function( event ) {
        event.preventDefault();
        this.trigger('formSubmit');
    }

});





mashApp.views.MovieListView =
     Backbone.View.extend({
        tagName: 'div',
        template: _.template("<div class='movie-list'></div>"),
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(this.template);
            $('body').append(this.$el);
        }

 }); // end MovieListView

//
//  // movieWatcher.promptMovieTime();
//  // movieWatcher.promptViewerRatingPreference();
//  // movieWatcher.promptFavoriteActors();
//  var list = new mashApp.views.MovieListView();
//   list.render();

//   //google.load('search', '1');
// var movieList = new mashApp.collections.MovieList();
// movieList.fetch();
// movieList.on('add', function(movie){
//   var model = new Backbone.Model();
//   model.set({movie: movie, watcher: movieWatcher});
//   var movieView = new mashApp.views.MovieView({model: model});
// });


// controller
mashApp.models.Controller = Backbone.Model.extend({
    initializeForm: function(options) {
        console.log('hii');
        // this should put the form on the page.
        this.movieWatcher = new mashApp.models.MovieWatcher();
        this.form = new mashApp.views.FormView();
        this.listenTo(this.form, 'formSubmit', this.sendInfoToModel );

        // listen to the model for changes to trigger the creation of the movie views
    },

    /**
     * This should grab data from the form and shove it into the model.
     * @return {[type]}
     */
    sendInfoToModel: function() {
        this.movieWatcher.set({timeLimit: $('input[name="movie-length"]').val()});
        var actorsList = '';
        $('input[name="actors"]').each(function(index) {
                actorList
        });
        console.log($('input[name="actors"]').val());
        //this.set({actors: $('input[name*="actors"]').val()});
        console.log(this.movieWatcher.get('timeLimit'));
        //console.log(this.movieWatcher.get('actors'));
    }
});

var control = new mashApp.models.Controller();
control.initializeForm();