const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const AllBot = require('allbot');
const ApiAI = require('apiai');

const ApiAiHandler = require('./controllers/apiaiwebhook');

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }));
app.use(function(req, res, next) {
  var data = '';
  req.on('data', function(chunk) { 
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody = data;
  });
  next();
});

const configuration = require('./init');
const allBot = new AllBot(configuration.allbot);
const apiAIHandler = new ApiAiHandler();
const apiai = ApiAI("05cb4f6a12624fc3954bafa7108c5b9b");

// Add this
allBot.onMessage((sessionKey,message) => {

  const textReceived = message.content.text;


  const requestApiAI = apiai.textRequest(textReceived, {
    sessionId: sessionKey
  });

  requestApiAI.on('response', function(response) {
    console.log(response.result);
    allBot.replyText(sessionKey,response.result.fulfillment.speech);
  });

  requestApiAI.on('error', function(error) {
    console.log(error);
    allBot.replyText(sessionKey,"Sorry please send again.");
  });

  requestApiAI.end();

  
  
});

app.get('/', function (req, res) {
  res.send('hello bot top')
});

app.use(configuration.allbot.endpointURL, allBot.router);
app.use(configuration.allbot.endpointURL + '/apiai', apiAIHandler.router);

app.listen(configuration.port, function () {
    console.log('Hello bot is listening on port ' + configuration.port)
})
