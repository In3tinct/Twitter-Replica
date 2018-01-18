/**
 * Created by Vaibhav on 3/9/2016.
 */

var ejs=require('ejs');
var daoObject=require('./mysql');
var mongodb = require("./mongodb");

/*function signup(req,res){
ejs.renderFile('./views/signup.ejs', function(err, result) {
    if (!err) {
        res.end(result);
    } else {
        res.end('An error occured');
        console.log(err);
    }
});
}*/

function index(req,res){
    //daoObject.createConnectionpool();
    res.render('index');
}

function trylogin(req,res){
    var username, password;
    username=req.body.username;
    password=req.body.password;

    //password = crypto.createHash("sha1").update(password).digest("HEX");

    var result;

    if(username!== ''  && password!== '')
    {
        mongodb.connect(function(){
            var coll=mongodb.collection('user_info');
            coll.findOne({email:username,password:password},function(err,user){
                if(user){
                    //Assigning the session
                    req.session.username = user.user_id;
                    req.session.fullname=user.first_name+" "+user.last_name;
                    console.log("Session initialized");
                    result = {"statusCode" : 200};
                    res.send(result);
                }else{
                    result = {"statusCode" : 401};
                    res.send(result);
                }
            });
        });
    }
    else
    {
        result = {"statusCode" : 401};
        res.send(result);
    }
}

//Logout the user - invalidate the session
function signout(req,res)
{
    req.session.destroy();
    res.redirect('/');
};

//exports.signup=signup;
exports.index=index;
exports.trylogin=trylogin;
exports.signout=signout;