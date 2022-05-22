const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
    axios.get(`/containers/json?all=${true}`)
        .then(response => {
            var containers = response.data;
            res.status(response.status).send(response.data);
        })
        .catch(error => {
            res.status(error.response.status).send(error.response.data);
        });
});

router.post('/create', (req, res) => {
    const {
        name,
        image,
        port
    } = req.body;

    url = `/containers/create?name=${name}`;
    axios.post(url, {
        Image: image,
        HostConfig: {
            PortBindings: {
                '80/tcp': [{
                    HostPort: port
                }]
            }
        }

    }).then(response => {
        Id = response.data.Id;
        var url = axios.defaults.baseURL + '/containers/' + response.data.Id + '/start';

        axios.post(url).then(response => {
                res.status(response.status).send(Id);
            })
            .catch(error => {
                res.status(error.response.status).send(error.response.data);
            });
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });

});

router.delete('/delete/:name', (req, res) => {
    const {
        name
    } = req.params;
    let url = axios.defaults.baseURL + '/containers/' + name;
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
    var containers;
    axios.get(`/containers/json?all=${true}`)
        .then(response => {
            containers = response.data;
            console.log(containers, containers.length);
            for (var i = 0; i < containers.length; i++) {
                console.log(containers[i].Id);
                var url = axios.defaults.baseURL + '/containers/' + containers[i].Id;
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
    app.use('/containers', router);
};