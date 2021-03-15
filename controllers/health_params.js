const HealthParameter = require('../models/health_params');

exports.createParameter = (customUserId, heartRate, isUrgent, callback) => {
    let body = {}
    body.userCustomId = customUserId;
    body.heartRate = heartRate;
    body.isUrgent = isUrgent;
    body.createDate = Date();
    let parameter = new HealthParameter(body);
    parameter.save(callback);
};

exports.insertParameters = (customUserId, items, callback) => {
    items.forEach(s => {
        s.userCustomId = customUserId;
        s.createDate = Date();
    });
    HealthParameter.insertMany(items, {}, callback)
};

exports.getAllParameters = (GMT, userCustomId, fromDate, toDate, offset, limit, callback) => {
    let condition = {};
    let gmt = Number.parseInt(GMT) || 0;
    let correctionGmt = gmt * 3600000;
    let correctedFromDate = Number.parseInt(Date.parse(fromDate).toString()) - correctionGmt;
    let correctedToDate = Number.parseInt(Date.parse(toDate).toString()) - correctionGmt;
    if (userCustomId) {
        condition.userCustomId = userCustomId;
    }
    if (fromDate) {
        if (!condition.createDate) {
            condition.createDate = {};
        }
        condition.createDate.$gt = correctedFromDate;
    }
    if (toDate) {
        if (!condition.createDate) {
            condition.createDate = {};
        }
        condition.createDate.$lt = correctedToDate;
    }
    let options = {
        skip: offset,
        limit: limit,
        sort: {createDate: -1}
    };
    HealthParameter.find(condition, {}, options, callback);
};

exports.getAllUserParams = (userCustomId, fromDate, toDate, GMT, callback) => {
    let options = {
        sort: {createDate: -1}
    };
    let gmt = Number.parseInt(GMT) || 0;
    let correctionGmt = gmt * 3600000;
    let correctedFromDate = Number.parseInt(Date.parse(fromDate).toString()) - correctionGmt;
    let correctedToDate = Number.parseInt(Date.parse(toDate).toString()) - correctionGmt;
    let condition = {};
    condition.userCustomId = userCustomId
    condition.createDate = {};
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    condition.createDate.$gt = correctedFromDate || yesterday;
    condition.createDate.$lt = correctedToDate || new Date();
    HealthParameter.find(condition, {}, options, callback)
}

exports.deleteParameter = (id, callback) => {
    HealthParameter.findOneAndDelete(id, callback);
};