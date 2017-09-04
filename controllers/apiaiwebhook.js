const express = require('express');
const router = express.Router();
const YQL = require('yql');

class ApiAIHandler {

    constructor() {

        router.post('/webhook', (req,res) => {


            console.log('Received POST request.',JSON.stringify(req.body, null, 3));
            
            let city = req.body.result.parameters['geo-city'];
            let date = req.body.result.parameters['date'];

            if(date == '')
                date = 'today';
            
            this.askWather(city).then((data) => {

                console.log('Yahoo API response.',JSON.stringify(data, null, 3));

                res.json({
                    'speech':" Weather for " + date + " in " + city + "? Probably it is sunny.",
                    'displayText':" Weather for " + date + " in " + city + "? Probably it is sunny.",
                });

            }).catch(() => {

                res.json({
                    'speech':req.body.result.fulfillment.speech,
                    'displayText':req.body.result.fulfillment.speech
                });

            });

        });

        this.router = router;

    }

    askWather(location){
        
        return new Promise((resolve,reject) => {
            
            const query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+location+'")');
            
            query.exec((err, data) => {
              var location = data.query.results.channel.location;
              var condition = data.query.results.channel.item.condition;
              
              if(err){
                  reject()
              }else{
                  resolve(data);
              }

            });

        });
        
    }
} 

module["exports"] = ApiAIHandler;