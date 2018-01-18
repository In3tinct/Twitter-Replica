/**
 * Created by Vaibhav on 3/11/2016.
 */

var mysql=require('./mysql');
var mongodb=require('./mongodb');

function setDynamicValuesToProfile(req,res){
    //Set these headers to notify the browser not to maintain any cache for the page being loaded

    if(req.body.user_id==null && req.body.whole_name==null){
        req.session.others_user_id = req.session.username;
        req.session.others_whole_name = req.session.fullname;
        res.send({'statusCode': 200});

        //Fetching retweet user whole name, not doing while fetching retweets as we have to run a loop
        //to fetch whole name, As we are only saving retweet people user_id in the tweet table for the retweet
    }else if(req.body.user_id!=null && req.body.whole_name==null) {
        var name;
        var getUserWholeName = "select CONCAT(first_name, ' ', last_name) as whole_name from user_info where user_id='" + req.body.user_id +"'";

        mysql.fetchWholename(function (err, results) {
                if (err) {
                    throw err;
                } else {
                    name=results[0].whole_name;
                    req.session.others_user_id = req.body.user_id;
                    req.session.others_whole_name=name;
                    res.send({'statusCode': 200});
                }
            },getUserWholeName);
    }else{
            req.session.others_user_id = req.body.user_id;
            req.session.others_whole_name = req.body.whole_name;
            res.send({'statusCode': 200})
        }
    /*res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('profile');*/
}

function redirectToProfile(req, res){


    //Checks before redirecting whether the session is valid
    if(req.session.username)
    {
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("profile",{username:req.session.username});
    }
    else
    {
        res.redirect('/');
    }
}

function fetchProfileInfo(req,res){
    var tweet;

                mongodb.connect(function(){
                    var anothercoll=mongodb.collection('tweet_post');

                    anothercoll.find({user_id:req.session.username}).sort({date_added:-1}).toArray(function(err,results){
                        if(err){
                            results = {"statusCode": 401};
                        }else{
                            if (results.length > 0) {
                                tweet = results;

                                var countFollowers;
                                var countFollowing;
                                var counttweets=tweet.length;
                                mongodb.connect(function(){
                                    var coll=mongodb.collection('followers');
                                    coll.find({user_id:req.session.username}).toArray(function(err,docs){
                                        if(docs){
                                            countFollowers=docs[0].followers.length;
                                            countFollowing=docs[0].following.length;

                                            var result={tweets:tweet, tweetCounts:counttweets, followingCounts:countFollowing, followersCounts:countFollowers,
                                                fullName:req.session.fullname,userHandle:req.session.username};
                                            res.send(result);

                                        }else{
                                            result = {"statusCode" : 401};
                                            res.send(result);
                                        }
                                    });
                                });

                            }


                        }
                    });
                });



    //Fetching tweets
    /*var sql="SELECT CONCAT(a.first_name, ' ', a.last_name) AS whole_name, b.user_id, b.tweet_comments FROM user_info a inner join tweet_post b on a.user_id=b.user_id where b.user_id='"+req.session.others_user_id+"'"+" order by date_added desc";
    console.log(sql);

    mysql.fetchTweets(function (err, results) {
        if (err) {
            throw err;
        } else {
            //Tweets can be empty so removing it, since we still need to fetc
            if (results.length > 0) {
                tweet=results;

                //Once the tweets are fetched we call for the counts
                var query="SELECT " +
                    "(SELECT count(*) FROM tweet_post where user_id='"+req.session.others_user_id+"') AS tweetCount," +
                    "(SELECT count(following_id) FROM following where user_id='"+req.session.others_user_id+"') AS followingCount," +
                    "(SELECT count(following_id) FROM following where following_id='"+req.session.others_user_id+"') AS followersCount";
                console.log(query);

                mysql.fetchCount(function (err, results) {
                    if (err) {
                        throw err;
                    } else {
                        var tweetCount=results[0].tweetCount;
                        var followingCount=results[0].followingCount;
                        var followersCount=results[0].followersCount;
                        var userHandle=req.session.others_user_id;
                        var fullName=req.session.others_whole_name;

                        if (results.length > 0) {
                            res.send({tweets:tweet, tweetCounts:tweetCount,followingCounts:followingCount,followersCounts:followersCount,
                                fullName:fullName,userHandle:userHandle});
                        } else {
                            results = {"statusCode": 401};
                        }
                    }

                }, query);


            }
        }

    }, sql);*/

}

function fetchUserTweetsForProfilePage(req,res){
    mongodb.connect(function(){
        var coll=mongodb.collection('tweet_post');
        coll.find({user_id:req.session.username}).sort({date_added:-1}).toArray(function(err,docs){
            if(err){
                docs = {"statusCode": 401};
                res.send(docs);
            }else{
                res.send(docs);
            }


        });
    });


    /*var sql="SELECT CONCAT(a.first_name, ' ', a.last_name) AS whole_name, b.user_id, b.tweet_comments FROM user_info a inner join tweet_post b on a.user_id=b.user_id where b.user_id='"+req.session.others_user_id+"'"+" order by date_added desc";
    console.log(sql);

    mysql.fetchTweets(function (err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                return results;
            } else {
                results = {"statusCode": 401};
                return results;
            }
        }

    }, sql);*/
}

function fetchFollowingList(req, res){

    mongodb.connect(function(){
        var coll=mongodb.collection('followers');
        coll.find({user_id:req.session.username}).toArray(function(err,docs){
            if(err){
                docs = {"statusCode": 401};
                res.send(docs);
            }else{
                    res.send(docs[0].following);
            }


        });
    });


    /*var sql="SELECT a.following_id, concat(b.first_name,' ',b.last_name) as whole_name FROM following a inner join user_info b on a.following_id=b.user_id where a.user_id='"+req.session.others_user_id+"'";
    console.log(sql);

    mysql.fetchFollowersAndFollowingList(function (err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                results = {"statusCode": 401};
                res.send(results);
            }
        }

    }, sql);*/

}

function fetchFollowersList(req,res){

    mongodb.connect(function(){
        var coll=mongodb.collection('followers');
        coll.find({user_id:req.session.username}).toArray(function(err,docs){
            if(err){
                docs = {"statusCode": 401};
                res.send(docs);
            }else{

                    res.send(docs[0].followers);

            }


        });
    });


    /*var sql="SELECT a.user_id, CONCAT(b.first_name,' ',b.last_name) as whole_name FROM following a  inner join user_info b on a.user_id=b.user_id where a.following_id='"+req.session.others_user_id+"'";
    console.log(sql);

    mysql.fetchFollowersAndFollowingList(function (err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                results = {"statusCode": 401};
                res.send(results);
            }
        }

    }, sql);*/

}

exports.setDynamicValuesToProfile=setDynamicValuesToProfile;
exports.fetchProfileInfo=fetchProfileInfo;
exports.redirectToProfile=redirectToProfile;
exports.fetchFollowingList=fetchFollowingList;
exports.fetchFollowersList=fetchFollowersList;