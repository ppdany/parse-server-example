// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = 'mongodb://heroku_7vlfbx32:qqg1rhs6dr16tvm9564kbagkau@ds133249.mlab.com:33249/heroku_7vlfbx32'; //process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var GCSAdapter = require('parse-server-gcs-adapter');

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_7vlfbx32:qqg1rhs6dr16tvm9564kbagkau@ds133249.mlab.com:33249/heroku_7vlfbx32', //'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: 'uJg0EQN75V7YZnQXJ7knEIe0r19uN0cDOHRsjsS3',
  masterKey: 'QvHLheflbQVNYH4dv3pijEkUs2WC6De2j3IHmHBO', //Add your master key here. Keep it secret!
  serverURL: 'http://foodstamp.herokuapp.com/parse', //http://localhost:1337/parse',  // Don't forget to change to https if needed
  clientKey: 'm8lHSnd5L5ZE9AsHoU2Pf02qguCpLASoNMZeKsQW', // added to test
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  filesAdapter: new GCSAdapter(
    "regal-cider-94904", //"GCP_PROJECT_ID",
    "Foodstamp-4d63d8262826.json", //"GCP_KEYFILE_PATH",
    "regal-cider-94904.appspot.com", //"GCS_BUCKET",
    {directAccess: true}
  )
});

/*
var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_7vlfbx32:qqg1rhs6dr16tvm9564kbagkau@ds133249.mlab.com:33249/heroku_7vlfbx32', //'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'uJg0EQN75V7YZnQXJ7knEIe0r19uN0cDOHRsjsS3',
  masterKey: process.env.MASTER_KEY || 'QvHLheflbQVNYH4dv3pijEkUs2WC6De2j3IHmHBO', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://foodstamp.herokuapp.com/parse', //http://localhost:1337/parse',  // Don't forget to change to https if needed
  clientKey: process.env.clientKey || 'm8lHSnd5L5ZE9AsHoU2Pf02qguCpLASoNMZeKsQW', // added to test
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
}); */
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
     // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
