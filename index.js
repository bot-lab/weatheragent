const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const AllBot = require('allbot');
const ApiAI = require('apiai');

const ApiAiHandler = require('./controllers/apiaiwebhook');
const ApiAiJapaneseHandler = require('./controllers/apiaiwebhook.ja');

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
const apiAIHandlerJapanese = new ApiAiJapaneseHandler();

const apiaiEn = ApiAI("05cb4f6a12624fc3954bafa7108c5b9b");
const apiaiJa = ApiAI("667b685c11e84b2c9ae353add7949088");

// Add this
allBot.onMessage((sessionKey,message) => {

  const textReceived = message.content.text;

  console.log('message',JSON.stringify(message, null, 3));  
  console.log('textReceived',textReceived);

  const userIdChunks = message.userIdentifier.split(':');
  const serviceId = userIdChunks[1];
  const requestApiAI = null;

  console.log('serviceId',serviceId);
  
  if(serviceId == 'facebook-weatherbot-en'){

    requestApiAI = apiaiEn.textRequest(textReceived, {
      sessionId: userIdChunks[2]
    });

    requestApiAI.on('response', function(response) {
      console.log('API AI response',JSON.stringify(response, null, 3));
  
      const replyFromAI = response.result.fulfillment.speech;
  
      if(replyFromAI && replyFromAI.length > 0)
        allBot.replyText(sessionKey,response.result.fulfillment.speech);
      else
        allBot.replyText(sessionKey,"Sorry cannot process your message.");
  
    });
  
    requestApiAI.on('error', function(error) {
      console.log(error);
      allBot.replyText(sessionKey,"Sorry please send again.");
    });

  }
  
  if(!requestApiAI){
    console.log('No service found');
    return;
  }
  

  requestApiAI.end();
  
});

app.get('/', function (req, res) {
  res.send('Weater bot top')
});

app.use(configuration.allbot.endpointURL, allBot.router);
app.use(configuration.allbot.endpointURL + '/apiai', apiAIHandler.router);
app.use(configuration.allbot.endpointURL + '/apiaija', apiAIHandlerJapanese.router);

app.listen(configuration.port, function () {
    console.log('Weater bot is listening on port ' + configuration.port)
})
