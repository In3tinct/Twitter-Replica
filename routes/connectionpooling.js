/**
 * Created by Vaibhav on 3/15/2016.
 */

var ejs=require("ejs");
var mysql = require('mysql');

pool = null;
last = 0;
function createConnectionPool(noOfConnections){

    pool = [];
    for(var i=0; i < noOfConnections; ++i)
    {
        pool.push(mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '12345',
            dateStrings : true,
            database : 'twitter_db',
            port	 : 3306
        }));
    }
}

function getConnectionFromConnectionPool ()
{
    if(!pool)
    {
        initializeConnection();
    }
    var connection = pool[last];
    last++;
    if (last == pool.length)
        last = 0;
    return connection;
}

function initializeConnection(){
    createConnectionPool(100);
}

function release(connection)
{
    pool.push(connection);
}

exports.getConnectionFromConnectionPool = getConnectionFromConnectionPool;
exports.release = release;