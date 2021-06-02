const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const logs = require('../controllers/logs');
const auth = require('../controllers/auth');

router.use(bodyParser.json());

router.post("/", (req, res) => {
    logs.createLogs(req.body, auth.receivePayload(req).customId, (err, logs) => {
        if (err) res.status(400).send(err);
        else res.status(201).send(logs.ops);
    })
});

module.exports = router;