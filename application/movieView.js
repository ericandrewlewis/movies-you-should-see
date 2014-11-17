mashApp.views.MovieView = Backbone.View.extend({
    tagName: 'div',
    className: 'movie-container',
    clicked : false,
    template: _.template('<h3 class="title"><%= attributes.title %></h3> <img src="<%=attributes.posters.thumbnail%>"/><p class="movie-worth"></p>'),
    movieMetaTemplate: _.template('<div class="movie-meta"><p class="runtime">Runtime: <%= attributes.runtime %> minutes</p><p class="audience-rating">Viewer Rating: <%= attributes.ratings.audience_score %> (out of 100)</p> </div>'),
    events: {
      'click': 'handleClick'
    },

    initialize: function() {
      //this.imageSearch;
      this.movieModel = this.model.attributes.movie;
      this.watcherModel = this.model.attributes.watcher;
      this.render();
      // this.updateImage();
    },
    render: function() {
      this.$el.html(this.template(this.movieModel));
      $('.movie-list').append(this.$el);
    },

    // updateImage: function(){
    //   // Create an Image Search instance.
    //           this.imageSearch = new google.search.ImageSearch();
    //           // Set searchComplete as the callback function when a search is
    //           // complete.  The imageSearch object will have results in it.
    //           this.imageSearch.setSearchCompleteCallback(this, this.searchComplete, null);
    //           this.imageSearch.execute("Fury movie poster");

    // },

    // searchComplete: function() {
    //   console.log(this.imageSearch.results);

    //   var results = this.imageSearch.results;
    //             for (var i = 0; i < 1; i++) {
    //               var result = results[i];
    //               var newImg = document.createElement('img');
    //               newImg.src = result.url;
    //               // Put our title + image in the content
    //               $('.movie-container').append(newImg);
    //             }

    // },
    handleClick: function() {
      if(!this.clicked) {
        var movieWorth = this.calculateWorth();
        this.$el.find('.movie-worth').append(movieWorth.worth);
        this.$el.find('.movie-worth').addClass(movieWorth.class);
        this.$el.append(this.movieMetaTemplate(this.movieModel));
      }
      this.clicked = true;
    },

    calculateLengthLimit: function(userTime, movieTime) {
      if (movieTime <= userTime) {
        return 2;
      } else if( (movieTime - userTime) <= 20) {
        return 1;
      } else {
        return 0;
      }
    },
    calculateViewerRatingLimit: function(userRating, movieRating) {
      if (userRating <= movieRating) {
        return 2;
      } else if((userRating - movieRating) <= 5) {
        return 1;
      } else {
        return 0;
      }
    },

    calculateWorth: function() {
      var movie = this.movieModel.attributes;
      var watcher = this.watcherModel.attributes;
      var ratingWorth = this.calculateViewerRatingLimit(watcher.viewerRatingLimit, movie.ratings.audience_score);
      var timeWorth = this.calculateLengthLimit(watcher.timeLimit, movie.runtime);
      var actorsToSee = "";
      for(var actor in movie.abridged_cast) {
        if(_.contains(watcher.actors, movie.abridged_cast[actor].name)) {
          actorsToSee = actorsToSee + movie.abridged_cast[actor].name + " ";
        }
      }
      if(actorsToSee !== "") {
        return {
          worth: "See because " + actorsToSee,
          class: "green"
          };
      }

      if(ratingWorth === 2 && timeWorth === 2 ) {
        return { worth: "It's a definite",
                class: "green"
        };
      } else if ( ratingWorth >= 1 && timeWorth >= 1) {
        return { worth: "You'd survive but it wouldn't be the best ever",
              class: "red"};

      } else if ( ratingWorth === 2 ) {
        return { worth: "Looks like it might be worth it",
                 class: "green"
              };
      }
      else {
        return {worth: "Ugh don't even bother",
                class: "red"};
      }

    },


}); // end movie-view