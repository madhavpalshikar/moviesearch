const path = require('path');
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(3000, (err)=>{
    if(err)
        console.error(err);

    console.log('Server started on port 3000');
})