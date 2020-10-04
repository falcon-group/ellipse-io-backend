var mongoose = require('mongoose');
var Note = require('./note').schema;
// define our students model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
    username : {type : String, default: ''},
    password : {type : String, default: ''},
    notes : [Note]
});