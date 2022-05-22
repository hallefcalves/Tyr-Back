const dotenv = require('dotenv');
const express = require('express');
const Path = require('path');
const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:2375'

dotenv.config({ path: Path.resolve(__dirname, '.env') });	

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

require('./controllers/containers')(app);
require('./controllers/images')(app);

app.listen(3000, () => {
    console.log('Server started');
});

app.get('/version', (req, res) => {
    axios.get('/version').then(response => {
        res.status(response.status).send(response.data);
    })
    .catch(error => {
        res.status(500).send(error.data);
    });
});