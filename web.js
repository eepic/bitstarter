var express = require('express');

var app = express.createServer(express.logger());
//var app = express(express.logger());

app.get('/', function(request, response) {
  //response.send('Hello World 2!');
    //var myBuffer = new Buffer('test');
    var fs = require('fs');
    var myBuffer = new Buffer (fs.readFileSync("index.html"));
    //console.log(myBuffer.toString());
    response.send(myBuffer.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
