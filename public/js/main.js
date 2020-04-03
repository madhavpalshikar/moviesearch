const searchApp = new Vue({
    el: '#searchApp',
    data: {
        title: "Movie Search",
        serviceURL: 'http://localhost:3000/search',
        movies: {},
        error: '',
        rules_basic: {
            "condition": "AND",
            "rules": [
                {
                    "id": "vote_average_f",
                    "field": "Vote Avarage",
                    "type": "double",
                    "input": "number",
                    "operator": "greater",
                    "value": 7
                },
                {
                    "condition": "OR",
                    "rules": [
                        {
                            "id": "genre_ids_is",
                            "field": "Genre",
                            "type": "integer",
                            "input": "select",
                            "operator": "equal",
                            "value": 18
                        },
                        {
                            "id": "genre_ids_is",
                            "field": "Genre",
                            "type": "integer",
                            "input": "select",
                            "operator": "equal",
                            "value": 27
                        }
                    ]
                }
            ],
            "valid": true
        }
    },
    mounted: function () {
        let jQueryBuilder = $('#builder').queryBuilder({
            "plugins": {

            },
            filters: [{
                id: 'popularity_f',
                label: 'popularity',
                type: 'double',
                operators: ['between', 'greater', 'less', 'equal']
            }, {
                id: 'vote_count_i',
                label: 'Vote Count',
                type: 'integer',
                operators: ['between', 'greater', 'less', 'equal']
            }, {
                id: 'id_i',
                label: 'Id',
                type: 'integer',
                operators: ['equal']
            }, {
                id: 'original_language_s',
                label: 'Original Language',
                type: 'string',
                operators: ['equal']
            }, {
                id: 'title_s',
                label: 'Title',
                type: 'string',
                operators: ['equal']
            }, {
                id: 'genre_ids_is',
                label: 'Genre',
                type: 'integer',
                input: 'select',
                values: {
                    '': '',
                    28: "Action",
                    12: "Adventure",
                    16: "Animation",
                    35: "Comedy",
                    80: "Crime",
                    99: "Documentary",
                    18: "Drama",
                    10751: "Family",
                    14: "Fantasy",
                    36: "History",
                    27: "Horror",
                    10402: "Music",
                    9648: "Mystery",
                    10749: "Romance",
                    878: "Science Fiction",
                    10770: "TV Movie",
                    53: "Thriller",
                    10752: "War",
                    37: "Western"
                },
                operators: ['equal']
            },
            {
                id: 'vote_average_f',
                label: 'Vote Average',
                type: 'double',
                operators: ['between', 'greater', 'less', 'equal']
            },
            {
                id: 'release_date_dt',
                label: 'Release Date',
                type: 'date',
                validation: {
                    format: 'MM/DD/YYYY'
                },
                plugin: 'datepicker',
                plugin_config: {
                    //format: 'YYYY-MM-DD',
                    todayBtn: 'linked',
                    todayHighlight: true,
                    autoclose: true
                },
                operators: ['between', 'greater', 'less', 'equal']
            }],

        });

        jQueryBuilder.queryBuilder('setRules', this.rules_basic);

        //loading default results for basic rules;
        this.search();
    },
    methods: {
        reset: function () {
            $('#builder').queryBuilder('reset');
        },
        get_solr_query: function (query) {
            let solr = ''
            query.rules.forEach((rule, i) => {
                if (typeof rule.rules !== "undefined") {
                    if (i > 0) {
                        solr = solr + ' ' + query.condition + ' ';
                    }
                    solr = solr + '(' + this.get_solr_query(rule) + ')';
                    console.log(rule, i);
                }
                else {
                    if (i > 0) {
                        solr = solr + ' ' + query.condition + ' ';
                    }

                    switch (rule.operator) {
                        case 'equal':
                            if (rule.type == "date") {
                                rule.value = moment(new Date(rule.value)).utc().format();
                            }

                            solr = solr + rule.id + ':' + rule.value;
                            break;
                        case 'less':
                            if (rule.type == "date") {
                                rule.value = moment(new Date(rule.value)).utc().format();
                            }

                            solr = solr + rule.id + ': [ * TO ' + rule.value + ']';
                            break;
                        case 'greater':
                            if (rule.type == "date") {
                                rule.value = moment(new Date(rule.value)).utc().format();
                            }
                            solr = solr + rule.id + ': [' + rule.value + ' TO * ]';
                            break;
                        case 'between':
                            if (rule.type == "date") {
                                rule.value[0] = moment(new Date(rule.value[0])).utc().format();
                                rule.value[1] = moment(new Date(rule.value[1])).utc().format();
                            }
                            solr = solr + rule.id + ': [' + rule.value[0] + ' TO ' + rule.value[1] + ']';
                            break;
                    }

                }
            });

            return solr;
        },
        search: function () {
            let self = this;
            let queryJson = $('#builder').queryBuilder('getRules');
            let solrQuery = this.get_solr_query(queryJson);
            console.log('solr', solrQuery);
            fetch(this.serviceURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ solrQuery: solrQuery })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Search Result', data);
                    self.error = '';
                    if (data.status == 200) {
                        this.movies = data.result;
                    }
                    else {
                        self.error = data.error.message;
                    }

                });
        }
    }
})