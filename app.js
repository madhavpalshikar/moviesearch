const path = require('path');
const express = require("express");
const service = require('./services/searchService');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/search',(req,res)=>{
    let response = service.getSearchResults(req.body.solrQuery);
    console.log(response);
    response.then(function (result) {
            let movies = service.cleanData(result.data);
            res.json({ status: 200, result: movies });
        })
        .catch(function (error) {
            console.log('error', error);
            res.json({ status: 400, error: error });
        });
    
});

app.listen(3000, (err)=>{
    if(err)
        console.error(err);

    console.log('Server started on port 3000');
})