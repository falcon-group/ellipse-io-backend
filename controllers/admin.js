// Load required packages
var config = require('../config'); // get config file
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Admin = require('../models/admin');
var Note = require('../models/note');
var User = require('../models/user');
const sortArray = require('sort-array');
exports.getUsers = function(req, res){
    const options ={
        offset : req.query.offset,
        limit : req.query.count,
        sort : req.query.orderBy,

    };
User.paginate({},options,function(err,result){
    return res.status(200).json(result);
})

};
exports.deleteUsers = function(req, res){
    User.findOneAndRemove({"_id":req.params.id},function(err,result){
        return res.status(200).json(result);
    })


};
function Arrpaginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}


exports.getById = function (req,res){
    User.find({"_id":req.params.id},function (err, user){
        console.log(user);
        if (err) {
            res.status(500).send(err);
        } else  {
            res.status(200).json(user);
        }
    });
};

exports.patchById = function (req,res){
    User.find({"_id":req.params.id}, function (err, user){
        if (err) {
            if (req.body.password && req.body.password !== "") {
                user.password = req.body.password
            }
            if (req.body.fio && req.body.fio !== "") {
                user.fio = req.body.password
            }
            if (req.body.inn && req.body.inn !== "") {
                user.inn = req.body.inn
            }
            user.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).json(user);
                }
            });
            res.status(500).send(err);
        } else  {
            res.status(200).json(user);
        }
    });
};

exports.getPaginate = function(req,res){
    User.find({"_id":req.params.id}, 'notes',function (err, user){
        if (err) {
            return res.status(500).send(err);
        } else  {
            return res.status(200).json(user);
        }
    });
};

exports.postAdmin = function(req, res) {
    Admin.find({"username":req.body.username}, function (err, user){

        if (err) {
            return res.status(500).send(err);
        }

        else if(user[0] == null) {
            var user = new Admin({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8)
            });
            user.save(function(err) {
                if (err)
                    return res.send(err);

                res.status(200).json({ message: 'Admin has been successfully created! ' });
            });
        }
        else {

            return res.status(302).json({message: 'Already created'});

        }
    });



};
exports.loginAdmin = function(req, res) {
    Admin.find({"username":req.body.username}, function (err, admin){

        if (err) {
            return res.status(500).send(err);
        }
        else if(admin[0] == null) {
            console.log("nenahod");
            return res.status(401).send({auth: false, token: null});
            // return false;
        }

        else {
            var passwordIsValid = bcrypt.compareSync(req.body.password, admin[0].password);


            if (err) { return res.status(500).send(err); }
// Password did not matchs
            if (!passwordIsValid) { return res.status(401).send("Wrong password");   }

            // Success
            var token = jwt.sign({username: req.body.username, isAdmin : 1}, config.secret, {
                expiresIn: 86400 // expires in 24 hours

            });
            console.log("PIDOR")
            return res.status(200).send({auth: true, token: token});
            //return res.status(200).json({"token":'Basic '+Buffer.from(req.body.username+":"+req.body.password).toString('base64'),"_id":user[0]._id});
            // return true;


        }
    });

};