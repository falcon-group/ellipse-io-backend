const HealthParameter = require('../models/health_params');

exports.createParameter = (customUserId, heartRate, callback) => {
    let body = {}
    body.userCustomId = customUserId;
    body.heartRate = heartRate;
    body.createDate = Date()
    let parameter = new HealthParameter(body);
    parameter.save(callback);
};

exports.getAllParameters = (userCustomId, fromDate, toDate, offset, limit, callback) => {
    let condition = {};
    if (userCustomId) {
        condition.userCustomId = userCustomId;
    }
    if (fromDate) {
        if (!condition.createDate) {
            condition.createDate = {};
        }
        condition.createDate.$gt = fromDate;
    }
    if (toDate) {
        if (!condition.createDate) {
            condition.createDate = {};
        }
        condition.createDate.$lt = toDate;
    }
    let options = {
        skip: offset,
        limit: limit,
        sort: {createDate: -1}
    };
    HealthParameter.find(condition, {}, options, callback);
};

exports.getAllUserParams = (userCustomId, fromDate, toDate, callback) => {
    let options = {
        sort: {createDate: -1}
    };
    let condition = {};
    condition.userCustomId = userCustomId
    condition.createDate = {};
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    condition.createDate.$gt = Date.parse(fromDate) || yesterday;
    condition.createDate.$lt = Date.parse(toDate) || new Date();
    HealthParameter.find(condition, {}, options, callback)
}

exports.deleteParameter = (id, callback) => {
    HealthParameter.findOneAndDelete(id, callback);
};