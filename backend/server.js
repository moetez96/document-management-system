const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db.js');
const documentRoute = require('./routes/document');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(db.url, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.log(err.message);
    });

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Connected at : ' + port);
});

app.use('/api/document', documentRoute)

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});