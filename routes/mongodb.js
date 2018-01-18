/**
 * Created by Vaibhav on 4/10/2016.
 */

var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var mongoURL = "mongodb://localhost:27017/twitter_db";

/**Connects to the MongoDB Database with the provided URL**/

exports.connect = function(callback){
    if(db==undefined) {
        MongoClient.connect(mongoURL, function (err, _db) {
            if (err) {
                throw new Error('Could not connect: ' + err);
            }
            db = _db;
            connected = true;
            console.log(connected + " is connected?");
            callback();
        });
    }else{
        callback();
    }
};

/**Returns the collection on the selected database**/

exports.collection = function(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);
};
