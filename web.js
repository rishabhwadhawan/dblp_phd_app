
var fs = require('fs');
var express = require('express');

var xml2js = require('xml2js');
var util = require('util');
var app = express();

var detailsfile = "details.html";

var phdfile = "phd.html";
var authorsfile = "authors.html";

var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); // to support JSON-encoded bodies

app.get('/phd', function(request, response) {
  var phdhtml = fs.readFileSync(phdfile).toString();
response.send(phdhtml);
});

app.get('/authors', function(request, response) {
  var authorshtml = fs.readFileSync(authorsfile).toString();
response.send(authorshtml);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log("Listening on " + port);
});


//THIS IS ALL PHD DATA FROM HERE DONT TOUCH
var text;

fs.readFile("phddata.xml",function(err,d){
  if(err) throw err;
  text = d.toString();
  });


var parser = new xml2js.Parser();

app.post('/app', function (req, res) {

  var beta = req.body.name.toString().toLowerCase(); 

  parser.parseString(text,function(err,result){
    
    var phd = result.dblp;
    
    var phdpeople = phd.phdthesis;
    console.log(phd.phdthesis.length);  
    for(i=0;i < phdpeople.length;i++)
    {
      
      var author = phdpeople[i].author.toString().toLowerCase();
      
      if(author == beta)
      {
        var school = phdpeople[i].school.toString().toLowerCase();
        console.log(school);
    
        res.send(school);
      }
    }
  });    
});

//AUTHORS START FROM HERE

//DETAILS PAGE FOR NEW AUTHOR POST AJAX FUNCTION

//THIS IS ALL AUTHORS DATA FROM HERE DONT TOUCH
var authorstext;

fs.readFile("authors.xml",function(err,d){
  if(err) throw err;
  authorstext = d.toString();
  });

app.get('/details', function(req,res){
  var details = fs.readFileSync(detailsfile).toString();
  res.send(details);
});

app.post('/authordetails', function (req, res) {
  res.status(200);
  res.send("Values Entered in Database");
});

app.post('/getlocation', function (req, res) {

  var name = req.body.name.toString().toLowerCase(); 
  var article = req.body.article.toString().toLowerCase(); 
 
  parser.parseString(authorstext,function(err,result){
    
    var authors = result.dblp;
    
    var articles = authors.article;
    
    for(i=0;i < articles.length;i++)
    {
      
      var articletitle = articles[i].title.toString().toLowerCase();
      
      if(articletitle == article)
      {
        var url = article[i].ee.toString().toLowerCase();
        console.log(url);    
        res.status(200);
      }
    }
  });    
});


  
