let samplequery = {
    "condition": "AND",
    "rules": [
        {
            "id": "vote_average_f",
            "field": "Vote Avarage",
            "type": "double",
            "input": "number",
            "operator": "greater",
            "value": 6.5
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

function get_solr_query(query) {
    let solr = ''
    query.rules.forEach((rule, i) => {
        if (typeof rule.rules !== "undefined") {
            if (i > 0) {
                solr = solr + ' ' + query.condition+' ';
            }
            solr = solr + '(' + get_solr_query(rule) + ')';
            console.log(rule, i);
        }
        else {
            if (i > 0) {
                solr = solr + ' ' + query.condition+' ';
            }

            switch (rule.operator) {
                case 'equal':
                    solr = solr + rule.id + ':' + rule.value;
                    break;
                case 'less':
                    solr = solr + rule.id + ': [ * TO ' + rule.value + ']';
                    break;
                case 'greater':
                    solr = solr + rule.id + ': [' + rule.value + ' TO * ]';
                    break;
                case 'between':
                    solr = solr + rule.id + ': [' + rule.value[0] + ' TO ' + rule.value[1] + ']';
                    break;
            }

        }
    });

    return solr;
}

console.log(get_solr_query(samplequery));

// $('#builder').queryBuilder({
//     plugins: {
//         'bt-tooltip-errors': {  // All options supported by the bootstrap tooltips plugin
//             container: 'body',
//             html: true,
//             placement: 'auto'
//         },
//         'bt-selectpicker': {  // All options supported by the selectpicker plugin
//             style: "btn-default",
//             width: 'auto'
//         },
//     },

//     filters: [{
//         id: 'popularity_f',
//         label: 'popularity',
//         type: 'double',
//         operators: ['between', 'greater', 'less', 'equal']
//     }, {
//         id: 'vote_count_i',
//         label: 'Vote Count',
//         type: 'integer',
//         operators: ['between', 'greater', 'less', 'equal']
//     }, {
//         id: 'id_i',
//         label: 'Id',
//         type: 'integer',
//         operators: ['equal']
//     }, {
//         id: 'original_language_s',
//         label: 'Original Language',
//         type: 'string',
//         operators: ['equal']
//     }, {
//         id: 'title_s',
//         label: 'Title',
//         type: 'string',
//         operators: ['equal']
//     }, {
//         id: 'genre_ids_is',
//         label: 'Genre',
//         type: 'integer',
//         input: 'select',
//         plugin: 'select2',
//         plugin_config: {  // All options supported by the select2 plugin
//             theme: 'bootstrap',
//             placeholder: "------",
//             width: "160px",
//             allowClear: true
//         },
//         values: {
//             '': '',
//             28: "Action",
//             12: "Adventure",
//             16: "Animation",
//             35: "Comedy",
//             80: "Crime",
//             99: "Documentary",
//             18: "Drama",
//             10751: "Family",
//             14: "Fantasy",
//             36: "History",
//             27: "Horror",
//             10402: "Music",
//             9648: "Mystery",
//             10749: "Romance",
//             878: "Science Fiction",
//             10770: "TV Movie",
//             53: "Thriller",
//             10752: "War",
//             37: "Western"
//         },
//         operators: ['equal']
//     },
//     {
//         id: 'vote_average_f',
//         label: 'Vote Average',
//         type: 'double',
//         operators: ['between', 'greater', 'less', 'equal']
//     }, {
//         id: 'release_date_dt',
//         label: 'Release Date',
//         type: 'date',
//         format: 'YYYY/MM/DD',
//         operators: ['between', 'greater', 'less', 'equal']
//     }],

// });

// $('#btn-reset').on('click', function () {
//     $('#builder').queryBuilder('reset');
// });

// $('#btn-set').on('click', function () {
//     $('#builder').queryBuilder('setRules', rules_basic);
// });

// $('#btn-get').on('click', function () {
//     var result = $('#builder').queryBuilder('getRules');

//     if (!$.isEmptyObject(result)) {
//         alert(JSON.stringify(result, null, 2));
//     }
// });