const express = require('express');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('urna'))


//routes
app.use(require('./routes/index'));

app.listen(4000);
console.log('Server on port 4000');


