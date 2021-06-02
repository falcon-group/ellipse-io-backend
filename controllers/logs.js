const Log = require('../models/log');

exports.createLog = (sessionId, content, callback) => {
    let body = {};
    body.sessionId = sessionId;
    body.content = content;
    body.createDate = Date();
    let note = new Log(body);
    note.save(callback);
};

exports.createLogs = (logs, customUserId, callback) => {
    logs.forEach(element => {
        element.createDate = Date();
        element.userCustomId = customUserId;
    });
    Log.collection.insertMany(logs, callback)
};

exports.getLogById = (id, callback) => {
    Log.findById(id, callback);
};

exports.getAllLogs = (sessionId, callback) => {
    let conditions = {};
    if (sessionId) {
        conditions.sessionId = sessionId;
    }
    let options = {
        sort: {createDate: -1}
    };
    Log.find(conditions, {}, options, callback);
};