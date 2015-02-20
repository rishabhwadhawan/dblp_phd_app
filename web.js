
var fs = require('fs');
var express = require('express');
var pythonshell = require('python-shell');
var xml2js = require('xml2js');
var util = require('util');
var bodyParser = require('body-parser');

var app = express();
var parser = new xml2js.Parser();

var detailsfile = "details.html";
var phdfile = "phd.html";
var authorsfile = "authors.html";

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

//THIS IS ALL AUTHORS DETAILS DATA FROM HERE DONT TOUCH

app.get('/details', function(req,res){
  var details = fs.readFileSync(detailsfile).toString();
  res.send(details);
});

app.post('/authordetails', function (req, res) {
  res.status(200);
  res.send("Values Entered in Database");
});

//AUTHORS DETAILS DATA ENDS

var authorstext;

fs.readFile("testdataauthors.xml",function(err,d){
  if(err) throw err;
  authorstext = d.toString();
  });

app.post('/getlocation', function (req, res) {

  var name = req.body.name.toString().toLowerCase(); 
  var article = req.body.article.toString().toLowerCase(); 

  parser.parseString(authorstext,function(err,result){
    
    var authors = result.dblp;
  
    var articles = authors.article;
  
    //console.log(articles);  
  
    for(i=0;i < articles.length;i++)
    {
      
      var articletitle = articles[i].title.toString().toLowerCase();
      var url = articles[i].ee.toString();
      var keys = articles[i].$;
     // console.log(article);
     // console.log(articletitle);
     // console.log(url)
      if(articletitle == article)
      {
          console.log(keys);
          console.log(url);
          var options = {
          mode: 'text',
          args: [url,keys.mdate,keys.key],
          pythonOptions: ['-u'],
          scriptPath: '/home/master/DBLP/dblp_phd_app/'
        };

        pythonshell.run('findloc.py',options,function(err,results){
          if(err) throw err;
          console.log(results.toString());
          res.send(results.toString());
        });
      }
    }
  });    
});


  
