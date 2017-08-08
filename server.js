var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var path = require('path');
var server = express();

var password = 'alzapiedi!';
var secret = 'f9q8347qyhtsd98r7hgsduifyht39q847aqfh';

function verifySecret(request, response, next) {
  request.cookies.key !== secret ? response.status(403).end() : next();
}

function streamPrivateFile(request, response, next) {
  var file = path.extname(request.path).length ? path.join(__dirname, '/private', request.path) : undefined;
  if (file && fs.existsSync(file)) fs.createReadStream(file).pipe(response);
  else next();
}

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/assets', express.static('client/assets'));
server.use('/assets/javascripts', express.static('client/build'));

server.use('/public', express.static('public'));
server.use('/private', verifySecret, streamPrivateFile);

server.post('/authenticate', function (request, response) {
  request.body.key === password ? response.cookie('key', secret).redirect('/') : response.status(403).end();
});

server.get('/', function(request, response) {
  request.cookies.key === secret ? response.sendFile(path.join(__dirname, '/index.html')) : response.sendFile(path.join(__dirname, '/login.html'));
})

server.get('/images', verifySecret, function (request, response) {
  fs.readdir(path.join(__dirname, 'private'), function (err, files) {
    if (err) response.status(500).end();
    else response.json({ files: files });
  });
});

server.listen(8081);
