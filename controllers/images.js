const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    axios.get('/images/json')
        .then(response => {
            res.status(response.status).send(response.data);
        })
        .catch(error => {
            res.status(error.response.status).send(error.response.data);
        });
});

router.post('/pull', (req, res) => {
    const {
        name,
        tag
    } = req.body;
    let url = `/images/create?fromImage=${name}:${tag}`;
    axios.post(url).then(response => {
        res.status(response.status).send(response.data);
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });
});

router.delete('/delete/:name', (req, res) => {
    const {
        name
    } = req.params;
    let url = axios.defaults.baseURL + '/images/' + name;
    axios.delete(url, {
            params: {
                force: true
            }
        }).then(response => {
            res.status(response.status).send(response.data);
        })
        .catch(error => {
            res.status(error.response.status).send(error.response.data);
        });
});

router.delete('/deleteall', (req, res) => {
    axios.get('/images/json')

        .then(response => {
            var images = response.data;
            for (var i = 0; i < images.length; i++) {
                var url = axios.defaults.baseURL + '/images/' + images[i].RepoTags;
                axios.delete(url, {
                        params: {
                            force: true
                        }
                    }).then(response => {
                        res.status(response.status).send(response.data);
                    })
                    .catch(error => {
                        res.status(error.response.status).send(error.response.data);
                    });
            }
        })
        .catch(error => {
            res.status(error.response.status).send(error.response.data);
        });
});


module.exports = app => {
    app.use('/images', router);
};