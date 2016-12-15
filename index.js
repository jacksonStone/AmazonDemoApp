var express = require('express'),
  https = require('https'),
  fs = require('fs'),
  credentials = JSON.parse(fs.readFileSync('credentials.json', 'UTF-8')),
  secretKey = credentials.amazon.AWSSecretKey,
  accessKey = credentials.amazon.AWSAccessKeyId,
  AWS = require('aws-sdk'),
  //AWS requires a credentials object when creating any of its API objects.
  //If none is included, it will check in ~/.aws/credentials for your access key and secret key
  awsCreds = new AWS.Credentials(accessKey, secretKey);
  SNS = new AWS.SNS({
    credentials:awsCreds, 
    apiVersion: '2010-03-31',
    //This will need to be set to your particular region
    region: 'us-east-1',
  });
  app = express();

//Express Setup
app.set('view engine', 'pug');
app.get('/', function (req, res) {
  res.render('index');
});

//Listening for a POST to /sendText
app.post('/sendText', function(req,res){
  var reqBody = '';
  req.on('data', function(d){
      reqBody += d+'';
  });
  req.on('end', function(d){
    //reqBody now contains the body of the ajax.post sent in sendText function in views/index.pug
    var body = JSON.parse(reqBody);
    //publish is only one of many methods SNS includes: http://docs.aws.amazon.com/sns/latest/api/API_Operations.html
    SNS.publish(body, (err, data) => {
      if(err){
        return res.end();
      }
      res.send('ok');
    });
  });
});

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});