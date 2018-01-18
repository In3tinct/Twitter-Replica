/**
 * Created by Vaibhav on 3/10/2016.
 */

var mysql=require("./mysql");
var mongodb=require('./mongodb');

function signup(req,res){
    res.render('signup');
}

function register(req,res){
    console.log(req.body.userhandle);
    var password=req.body.password;

    //password = crypto.createHash("sha1").update(password).digest("HEX");

    mongodb.connect(function() {
        var coll = mongodb.collection('user_info');

        coll.insert({
            email: req.body.email,
            user_id: req.body.userhandle,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: password
        }, function (err) {
            var result;
            if(err){
                result = {"statusCode" : 404};
                console.log("Error while inserting data");
                res.send(result);
            }else{
                //Assigning the session
                req.session.username = req.body.userhandle;
                req.session.fullname=req.body.first_name+" "+req.body.last_name;
                console.log("Session initialized");

                result = {"statusCode" : 200};
                console.log("Data inserted successfully");
                res.send(result);
            }
        });
    });

    /*var query = "insert into user_info(`user_id`,`email`,`password`,`first_name`, `last_name`) VALUES  " +
        "( '"+req.body.userhandle+"' , '"+ req.body.email +"' ,'" +
        password +"' ,'" + req.body.first_name +"'" +
        ",'" + req.body.last_name +"')";

    console.log(query);

    mysql.signupUser(function(err){
        var result;
        if(err){
            result = {"statusCode" : 404};
            console.log("Error while inserting data");
            res.send(result);
        }else{
            //Assigning the session
            req.session.username = req.body.userhandle;
            req.session.fullname=req.body.first_name+" "+req.body.last_name;
            console.log("Session initialized");

            result = {"statusCode" : 200};
            console.log("Data inserted successfully");
            res.send(result);
        }
    },query);*/
}

exports.signup=signup;
exports.register=register;
