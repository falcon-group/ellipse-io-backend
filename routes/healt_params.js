const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const healthParams = require('../controllers/health_params');
const auth = require('../controllers/auth');

router.use(bodyParser.json());

router.post("/", (req, res) => {
    healthParams.insertParameters(auth.receivePayload(req).customId, req.body, (err, notes) => {
        if (err) res.status(400).send(err);
        else res.status(201).send(notes);
    });
});

module.exports = router;