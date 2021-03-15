const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const notes = require('../controllers/notes');
const params = require('../controllers/health_params');
const users = require('./users');
const tmp = require('tmp');
const reader = require('xlsx');

router.use(bodyParser.json());

router.get('/notes', (req, res) => {
    let query = req.query
    let page = parseInt(query.page) || 1;
    let perPage = parseInt(query.perPage) || 20;
    notes.getAllNotes(
        query.customUserId,
        query.title,
        query.content,
        (page - 1) * perPage,
        perPage,
        (err, notes) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(notes);
        }
    )
});

router.get("/health_params", (req, res) => {
    let query = req.query
    let page = parseInt(query.page) || 1;
    let perPage = parseInt(query.perPage) || 20;
    params.getAllParameters(
        query.GMT,
        query.userCustomId,
        query.fromDate,
        query.toDate,
        (page - 1) * perPage,
        perPage,
        (err, notes) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(notes);
        });
});

router.get("/users/:id/health_params", (req, res) => {
    const {id} = req.params;
    let query = req.query || {};
    tmp.file({postfix: '.xlsx'}, (err, path, fd, cleanupCallback) => {
        if (err) {
            cleanupCallback();
            return res.status(500).send(err);
        }
        params.getAllUserParams(id, query.fromDate, query.toDate, query.GMT, (err, params) => {
            if (err) {
                cleanupCallback();
                return res.status(500).send(err);
            }
            var options = { hour12:false, timeZone : 'Europe/Kiev' , timeZoneName : 'short' };
            let users = params.map(item => {
                return {
                    "Идентификатор": item._id.toHexString(),
                    "Пользователь": item.userCustomId,
                    "Приступ": item.isUrgent,
                    "Дата": item.createDate.toLocaleString('ru',options),
                    "Пульс": item.heartRate
                }
            })
            let ws = reader.utils.json_to_sheet(users);
            let book = reader.utils.book_new();
            reader.utils.book_append_sheet(book, ws, "Health parameter");
            reader.writeFile(book, path);
            res.download(path, err1 => {
                if (err1) {
                    res.status(500).send(err1)
                }
                cleanupCallback();
            });
        });
    });

});

router.use('/users', users)

module.exports = router;
