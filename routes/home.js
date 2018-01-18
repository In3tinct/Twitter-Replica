/**
 * Created by Vaibhav on 3/10/2016.
 */

var daoObject=require('./mysql');
var mongodb=require('./mongodb');

function home(req,res){
    //Checks before redirecting whether the session is valid
    if(req.session.username)
    {
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("home",{username:req.session.username});
    }
    else
    {
        res.redirect('/');
    }
}

function fetchTweets(req,res){

    //Fetching followers list

    mongodb.connect(function(){
        var coll=mongodb.collection('followers');
        coll.find({user_id:req.session.username}).toArray(function(err,docs){
            if(err){
                docs = {"statusCode": 401};
            }else {
                if (docs.length > 0){
                    mongodb.connect(function () {
                        var anothercoll = mongodb.collection('tweet_post');
                        anothercoll.find({user_id: {$in: docs[0].following}}).sort({date_added: -1}).toArray(function (err, results) {
                            if (err) {
                                results = {"statusCode": 401};
                            } else {
                                res.send(results);
                            }
                        });
                    });
            }else{
                    mongodb.connect(function () {
                        var anothercoll = mongodb.collection('tweet_post');
                        anothercoll.find({user_id: req.session.username}).sort({date_added: -1}).toArray(function (err, results) {
                            if (err) {
                                results = {"statusCode": 401};
                            } else {
                                res.send(results);
                            }
                        });
                    });
                }
            }


        });
    });


/*
    var sql="SELECT b.retweet_user, CONCAT(a.first_name, ' ', a.last_name) AS whole_name, b.user_id, b.tweet_comments FROM user_info a inner join tweet_post b on a.user_id=b.user_id where b.user_id IN (select following_id from following where user_id='"+req.session.username+"') " +
        "or b.user_id='"+req.session.username+"'"+" order by date_added desc";
    console.log(sql);

        daoObject.fetchTweets(function (err, results) {
            if (err) {
                throw err;
            } else {
                if (results.length > 0) {
                    res.send(results);
                } else {
                    results = {"statusCode": 401};
                }
            }

        }, sql);*/
}

function getCountsTFF(req,res){

    var countFollowers;
    var countFollowing;
    var counttweets;
    mongodb.connect(function(){
        var coll=mongodb.collection('followers');
        coll.find({user_id:req.session.username}).toArray(function(err,docs){
            if(docs){
                if(docs.length>0) {
                    countFollowers = docs[0].followers.length;
                    countFollowing = docs[0].following.length;

                    mongodb.connect(function () {
                        var collanother = mongodb.collection('tweet_post');
                        counttweets = collanother.find({user_id: req.session.username}).count({}, function (error, count) {
                            counttweets = count;

                            var result = {
                                tweetCounts: counttweets,
                                followingCounts: countFollowing,
                                followersCounts: countFollowers,
                                fullName: req.session.fullname,
                                userHandle: req.session.username
                            };
                            res.send(result);
                        });

                    });
                }else{

                    countFollowers = 0;
                    countFollowing = 0;

                    mongodb.connect(function () {
                        var collanother = mongodb.collection('tweet_post');
                        counttweets = collanother.find({user_id: req.session.username}).count({}, function (error, count) {
                            counttweets = count;

                            var result = {
                                tweetCounts: counttweets,
                                followingCounts: countFollowing,
                                followersCounts: countFollowers,
                                fullName: req.session.fullname,
                                userHandle: req.session.username
                            };
                            res.send(result);
                        });

                    });


                }
            }else{
                result = {"statusCode" : 401};
                res.send(result);
            }
        });
    });

    /*var query="SELECT " +
        "(SELECT count(*) FROM tweet_post where user_id='"+req.session.username+"') AS tweetCount," +
        "(SELECT count(following_id) FROM following where user_id='"+req.session.username+"') AS followingCount," +
        "(SELECT count(following_id) FROM following where following_id='"+req.session.username+"') AS followersCount";
    console.log(query);

    daoObject.fetchCount(function (err, results) {
        if (err) {
            throw err;
        } else {
            var tweetCount=results[0].tweetCount;
            var followingCount=results[0].followingCount;
            var followersCount=results[0].followersCount;
            var userHandle=req.session.username;
            var fullName=req.session.fullname;

            if (results.length > 0) {
                res.send({tweetCounts:tweetCount,followingCounts:followingCount,followersCounts:followersCount,
                    fullName:fullName,userHandle:userHandle});
            } else {
                results = {"statusCode": 401};
            }
        }

    }, query);*/
}

function insertTweet(req,res){
    var containsHashTags;
    var retweet_user;
    var tweet_comments;

    //If it is a tweet and contains Hash
    if(req.body.tweetpost!=undefined && req.body.tweetpost!='') {
        if (req.body.tweetpost.indexOf('#') > -1) {
            containsHashTags = true;
        } else {
            containsHashTags = false;
        }
        tweet_comments=req.body.tweetpost;
    }

    //If it is a retweet and it contains hash
    if(req.body.isRetweet==true){
        if (req.body.retweet_post.indexOf('#') > -1) {
            containsHashTags = true;
        } else {
            containsHashTags = false;
        }
        retweet_user=req.body.retweet_user_id;
        tweet_comments=req.body.retweet_post;
    }else{
        retweet_user=null;
    }

    var trimmedHashTag="";
    if(containsHashTags) {
        //Trimming the hashtag from the comment
        var indexOfHash = (tweet_comments.indexOf('#'));
        trimmedHashTag = tweet_comments.substring(indexOfHash, tweet_comments.length);
    }


    var dateAdded=new Date().toISOString().slice(0, 19).replace('T', ' ');
    var nexttweetid;

    mongodb.connect(function(){
        var coll=mongodb.collection('tweet_post');

        coll.find().sort({tweet_id:-1}).limit(1).toArray(function(err,user){
            if(!err){
                nexttweetid=user[0].tweet_id+1;

                coll.insert({tweet_id:nexttweetid,user_id:req.session.username,tweet_comments:tweet_comments,contain_hashtags:containsHashTags
                    ,date_added:dateAdded,retweet_user:retweet_user,hashtag:trimmedHashTag},function(err){
                    if(!err){
                        result = {"statusCode" : 200};
                        res.send(result);
                    }else{
                        result = {"statusCode" : 401};
                        res.send(result);
                    }
                });
            }else{
                result = {"statusCode" : 401};
                res.send(result);
            }
        });


    });







    /*var query = "insert into tweet_post(`user_id`,`tweet_comments`,`contain_hashtags`,`date_added`, `retweet_user`) VALUES  " +
        "( '"+req.session.username+"' , '"+ tweet_comments +"' ,'" +
        containsHashTags +"' ,'" + dateAdded +"'" +
        ",'" + retweet_user +"');";

    console.log(query);


    //Inserting tweet
    daoObject.insertTweet(function(err){
        var result;
        if(err){
            result = {"statusCode" : 401};
            console.log("Error while inserting data");
            res.send(result);
        }else{
            //After inserting and no error
            if(containsHashTags = 1){

                //Trimming the hashtag from the comment
                var indexOfHash=(tweet_comments.indexOf('#'));
                var trimmedHashTag=tweet_comments.substring(indexOfHash, tweet_comments.length);

                //Fetching the last inserted record into the tweet table since we need to insert that tweet id into hashtag table
                var lastTweetId;
                var fetchLastTweetId="select max(tweet_id) as lastInsertedTweetId from tweet_post;"
                daoObject.fetchLatestTweetEntryId(function (err, results) {
                    if (err) {
                        throw err;
                    } else {
                        lastTweetId=results[0].lastInsertedTweetId;

                        //Inserting hashTags
                        var insertHashTags="insert into hash_tags(hash_tag_value,tweet_id) values('"+trimmedHashTag+"','"+lastTweetId+"')";
                        daoObject.insertHashTag(function (err) {
                            if (err) {
                                throw err;
                            } else {
                               console.log("hashtag inserted succesfully");
                            }
                        }, insertHashTags);
                    }

                }, fetchLastTweetId);
            }

            result = {"statusCode" : 200};
            console.log("Data inserted successfully");
            res.send(result);
        }
    },query);*/
}

function setSearchValue(req,res){
    req.session.search=req.body.searchValue;
    if(req.body.searchValue.indexOf("#")>-1){
        res.send({'statusCode': 200, 'searchHash':true});
    }else{
        res.send({'statusCode': 200, 'searchHash':false});
    }
}

function openHashPage(req,res){
res.render('hashSearchPage');
}

function openSearchPage(req,res){
    res.render('searchUser');
}

function fetchHashTweets(req,res){


    mongodb.connect(function(){
        var collanother=mongodb.collection('tweet_post');
        counttweets=collanother.find({hashtag:req.session.search}).toArray(function (error, results) {
            if(error){
                result = {"statusCode" : 401};
                console.log("Error while inserting data");
                res.send(result);
            }else{
                if(results.length>0) {
                    result = {"statusCode": 200};
                    res.send(results);
                }else{
                    result={"statusCode":'No Record Found'}
                    res.send(result);
                }
            }
        });

    });


/*
   var searchHash="SELECT a.tweet_comments, a.user_id FROM tweet_post a inner join hash_tags b ON  a.tweet_id=b.tweet_id " +
        "where hash_tag_value='"+req.session.search+"'";

    daoObject.searchHashTweets(function(err,results){
        if(err){
            result = {"statusCode" : 401};
            console.log("Error while inserting data");
            res.send(result);
        }else{
            if(results.length>0) {
                result = {"statusCode": 200};
                res.send(results);
            }else{
                result={"statusCode":'No Record Found'}
            }
        }
    },searchHash);*/
}

function fetchUserWithSearch(req,res){
    var ifFollowing;
    var followingList=[];
    var finalFollowingList=[];

    var searchUser="SELECT concat(first_name,' ',last_name) as whole_name,user_id from user_info where first_name LIKE '"+req.session.search+"%' " +
        "or last_name LIKE '"+req.session.search+"%'";

    console.log(searchUser);
    daoObject.checkUser(function(err,results){
        if(err){
            result = {"statusCode" : 401};
            console.log("Error while inserting data");
            res.send(result);
        }else{
            if(results.length>0) {
                result = {"statusCode": 200};

                //Checking if the logged in user is already following the person
                for(var i=0;i<results.length;i++) {
                    var checkIfFollowing = "select * from following where user_id='"+req.session.username+"' and following_id='"+results[i].user_id+"'";
                    console.log(checkIfFollowing);
                    daoObject.lookIfFollowingExist(function(err,followingResults){
                        if(err){
                            console.log(err);
                        }else{
                            if(followingResults.length>0) {
                                ifFollowing=true;
                                //var object = {whole_name: results[i].whole_name, user_id: results[i].user_id, isFollowed:ifFollowing};
                                var object = {isFollowed:ifFollowing};
                                followingList.push(object);

                                //Making a new json object with three parameters, since two were already in list from the first Search query
                                if(followingList.length==results.length){
                                    for(var i=0;i<followingList.length;i++){
                                        var object = {whole_name: results[i].whole_name, user_id: results[i].user_id, isFollowed:followingList[i].isFollowed,searchKey:req.session.search};
                                        finalFollowingList.push(object);
                                    }
                                    res.send(finalFollowingList);
                                }
                            }else{
                                ifFollowing=false;
                                //var object = {whole_name: results[i].whole_name, user_id: results[i].user_id, isFollowed:ifFollowing};
                                var object = {isFollowed:ifFollowing};
                                followingList.push(object);

                                //Making a new json object with three parameters, since two were already in list from the first Search query
                                if(followingList.length==results.length){
                                    for(var i=0;i<followingList.length;i++){
                                        var object = {whole_name: results[i].whole_name, user_id: results[i].user_id, isFollowed:followingList[i].isFollowed,searchKey:req.session.search};
                                        finalFollowingList.push(object);
                                    }

                                    res.send(finalFollowingList);
                                }
                            }
                        }
                    },checkIfFollowing);

                }

                //TO ASK, this gets called first, also value of I above in for loop directly becomes 2
                //res.send(finalFollowingList);


                /*for(var i=0;i<results.length;i++) {
                    var object = {whole_name: results[i].whole_name, user_id: results[i].user_id, isFollowed:IffollowingList[i]};
                    finalFollowingList.push(object);
                }*/

            }else{
                result={"statusCode":'No Record Found'};
                result.send(result);
            }
        }
    },searchUser);
}

function followUser(req,res){

    var insertFollowing="insert into following(user_id,following_id) values('"+req.session.username+"','"+req.body.followingId+"')";
    daoObject.insertHashTag(function (err) {
        if (err) {
            throw err;
        } else {
            console.log("hashtag inserted succesfully");
            fetchUserWithSearch(req,res);

        }
    }, insertFollowing);

}
exports.home=home;
exports.fetchTweets=fetchTweets;
exports.getCountsTFF=getCountsTFF;
exports.insertTweet=insertTweet;
exports.setSearchValue=setSearchValue;
exports.openHashPage=openHashPage;
exports.openSearchPage=openSearchPage;
exports.fetchHashTweets=fetchHashTweets;
exports.fetchUserWithSearch=fetchUserWithSearch;
exports.followUser=followUser;