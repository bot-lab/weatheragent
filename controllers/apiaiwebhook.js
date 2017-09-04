const express = require('express');
const router = express.Router();
const YQL = require('yql');

class ApiAIHandler {

    constructor() {

        router.post('/webhook', (req,res) => {


            let city = req.body.result.parameters['geo-city'];
            let date = req.body.result.parameters['date'];

            if(date == ''){
                date = new Date().toISOString().slice(0,10);
            }
            
            if(city){

                this.askWather(city).then((data) => {
    
                    console.log('Yahoo API response.',JSON.stringify(data, null, 3));
    
                    const forecasts = data.query.results.channel.item.forecast;
    
                    let forecast = forecasts.find((item) => {
    
                        const formatedDate = new Date(item.date).
                        toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                        replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
                        
                        console.log(formatedDate,date);
                        
                        return formatedDate = date;
    
                    });
    
                    if(forecast){
                        
                        res.json({
                            'speech':" Weather for " + date + " in " + city + "? It is " + forecast.text,
                            'displayText':" Weather for " + date + " in " + city + "? It is " + forecast.text
                        });
    
                    } else {
    
                        res.json({
                            'speech':" Sorry Yahoo Weather API doesnt know the answer.",
                            'displayText':" Sorry Yahoo Weather API doesnt know the answer."
                        });
    
                    }
    
                }).catch((err) => {
                    
                    console.log('yahoo api error',err);

                    res.json({
                        'speech':req.body.result.fulfillment.speech,
                        'displayText':req.body.result.fulfillment.speech
                    });
    
                });

            } else {

                res.json({
                    'speech':req.body.result.fulfillment.speech,
                    'displayText':req.body.result.fulfillment.speech
                });

            }
            

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
                  reject(err)
              }else{
                  resolve(data);
              }

            });

        });
        
    }
} 

module["exports"] = ApiAIHandler;