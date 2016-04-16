
//<--- ==================================================================== -- >

//Declaring Variables for database setup   
var fs = ""; 
var dbName = "";
var exists = "";
 
var sqlite3 = ""
var db = ""

function dbSetUp() {
    fs = require("fs");
    dbName = "profiles.db";
    exists = fs.existsSync(dbName);
    sys = require('sys');
    sqlite3 = require("sqlite3").verbose();
     db = new sqlite3.Database(dbName);
}

/*
function displaydb() {
    dbSetUp();
    
    db.serialize(function() {
    db.all("SELECT name, email from userlist", function(err, row){
        
        
    });      
});
db.close();
}
*/

function adddb(namefield, userfield , passwordfield) {
    dbSetUp();
    
    db.serialize(function() {
    if(!exists) {
        db.run("CREATE TABLE userlist(name TEXT, username TEXT, password TEXT)");
    }
    var stmt = db.prepare("INSERT into userlist values(?,?,?)");
    stmt.run(namefield, userfield, passwordfield);
    
    stmt.finalize();    
});
db.close();
}

function deletedb(namefield) {
    
    dbSetUp();
    
    db.run("DELETE FROM userlist WHERE username = ?",[namefield], function(error){
                
                if(error){
                 console.log(error);
                } 
                
            });
    
db.close();
return ;
}
//<--- ==================================================================== -- >

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use('/assets', express.static(__dirname + '/public'));

var uName = "";
var pwd = "";
var name = "";

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
});

// Sign In
app.post('/signIn', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
    
  uName = req.body.userName;
  pwd = req.body.password;
  
  dbSetUp();
  db.serialize(function() {
              
  db.all("SELECT name, username, password from userlist", function(err, row){
      var flag = 0;
        
      for(var i=0; i<row.length; i++) {
           if(row[i].username === uName && row[i].password === pwd) {
               flag = 1;
           }
       }
       if(flag == 1) {
           res.json(row);
       }
       
       else {
           res.json( "error");   
       }
    });       
});
db.close();

});
 
 
// New user register 
 app.post('/newUser', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  
  name = req.body.name;  
  uName = req.body.email;
  pwd = req.body.passwordRegister;
  adddb(name, uName, pwd);
  
  dbSetUp();
  db.serialize(function() {
              
  db.all("SELECT name, username, password from userlist", function(err, row){
      var flag = 0;
        
      for(var i=0; i<row.length; i++) {
           if(row[i].username === uName) {
               flag = 1;
           }
       }
       if(flag == 1) {
           res.json( "error"); 
       }
       
       else {
           res.json(row);
             
       }
    });       
});
db.close();

});


//Delete Operation

app.post('/delete', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
    
  uName = req.body.usernamedel;
  pwd = req.body.passworddel;
  
  dbSetUp();
  db.serialize(function() {
              
  db.all("SELECT name, username, password from userlist", function(err, row){
   var flag = 0;
        
    for(var i=0; i<row.length; i++) {
        if(row[i].username === uName && row[i].password === pwd) {
              
               flag = 1;
               
            }
        }
        if(flag == 1) {
        
          deletedb(uName);
           res.json("success");
       }
       
     else {
           
            res.json( "error");
             
        }
    });       
});
db.close();

});
  

  app.listen(3000);



