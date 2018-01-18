/**
 * Created by Vaibhav on 3/10/2016.
 */

var connectionpooling=require('./connectionpooling')

var connect;/*
 function createConnectionpool(){
 connect=connectionpooling.connectionpooling();
 console.log("connection created");
 }*/

function checkUser(callback, query){

    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    console.log("connection created");
    console.log("in check user");
    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function signupUser(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    dbconnection.query(query, function(err){
        console.log(err);
        callback(err);
        connectionpooling.release(dbconnection);
    })
}

function fetchTweets(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function fetchCount(callback , query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function insertTweet(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    dbconnection.query(query, function(err){
        console.log(err);
        callback(err);
        connectionpooling.release(dbconnection);
    });
}

function searchHashTweets(callback, query){

    var dbconnection=connectionpooling.getConnectionFromConnectionPool();

    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function fetchLatestTweetEntryId(callback, query){

    var dbconnection=connectionpooling.getConnectionFromConnectionPool();

    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function fetchFollowersAndFollowingList(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();

    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function insertHashTag(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    dbconnection.query(query, function(err){
        console.log(err);
        callback(err);
        connectionpooling.release(dbconnection);
    });
}

function fetchWholename(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();

    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

function insertFollowing(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();
    dbconnection.query(query, function(err){
        console.log(err);
        callback(err);
        connectionpooling.release(dbconnection);
    });
}

function lookIfFollowingExist(callback,query){
    var dbconnection=connectionpooling.getConnectionFromConnectionPool();

    dbconnection.query(query, function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            callback(err,rows);
            connectionpooling.release(dbconnection);
        }
    });
}

//exports.createConnectionpool=createConnectionpool;
exports.checkUser=checkUser;
exports.signupUser=signupUser;
exports.fetchTweets=fetchTweets;
exports.fetchCount=fetchCount;
exports.insertTweet=insertTweet;
exports.searchHashTweets=searchHashTweets;
exports.fetchLatestTweetEntryId=fetchLatestTweetEntryId;
exports.insertHashTag=insertHashTag;
exports.fetchWholename=fetchWholename;
exports.fetchFollowersAndFollowingList=fetchFollowersAndFollowingList;
exports.insertFollowing=insertFollowing;
exports.lookIfFollowingExist=lookIfFollowingExist;