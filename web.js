var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  //response.send('Hello World 2!');
    //var myBuffer = new Buffer('test');
    var myBuffer = fs.readFileSync("index.html");
    //console.log(myBuffer.toString());
    response.send(myBuffer.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
