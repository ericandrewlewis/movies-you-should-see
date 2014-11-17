mashApp.models.Movie = Backbone.Model.extend();

mashApp.models.MovieWatcher = Backbone.Model.extend({
    //timeLimit, viewerRatingLimit
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
    template: _.template('<label for="movie-length">Length of longest movie you would sit through: </label><input type="text" name="movie-length"/><label for="movie-rating">Rating of lowest rated movie you would sit through: </label><input type="text" name="movie-rating"/><button type="button" class="submit-button" name="submit">Submit!</button>'),
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
        this.movieWatcher.set({viewerRatingLimit: $('input[name="movie-rating"]').val()});
        this.createMovieList();
    },

    createMovieList: function() {
        this.list = new mashApp.views.MovieListView();
        this.movieList = new mashApp.collections.MovieList();
        this.movieList.fetch();
        var self = this;
        this.movieList.on('add', function(movie){
          this.model = new Backbone.Model();
          this.model.set({movie: movie, watcher: self.movieWatcher});
          this.movieView = new mashApp.views.MovieView({model: this.model});
        });
    }
});

var control = new mashApp.models.Controller();
control.initializeForm();