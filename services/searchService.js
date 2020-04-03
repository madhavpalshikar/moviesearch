const axios = require('axios');
const genres = require('../constants/constants');

exports.getSearchResults = function (solrQuery) {
    return axios.get('https://us-east-1.websolr.com/solr/e74f806321cd/select?wt=json&q=' + solrQuery);
}

exports.cleanData = function (data) {
    let movies = {};

    movies.numFound = data.response.numFound;
    movies.movies = [];

    data.response.docs.forEach(movie => {
        let record = {};
        let genresList = [];
        movie.genre_ids_is.forEach(genre => {
            genresList.push(genres[genre]);
        })

        record.popularity = movie.popularity_f;
        record.vote_count = movie.vote_count_i;
        record.video_b = movie.video_b;
        record.poster_path_s = movie.poster_path_s;
        record.id = movie._yz_id;
        record.rated_r = movie.rated_r_b;
        record.backdrop_path = movie.backdrop_path_s;
        record.original_language = movie.original_language_s;
        record.original_title = movie.original_title_s;
        record.genres = genresList;
        record.title = movie.title_s;
        record.vote_average = movie.vote_average_f;
        record.overview = movie.overview_s;
        record.release_date = movie.release_date_dt;

        movies.movies.push(record);
    });

    return movies;
}