const express = require('express');
const router = express.Router();

class ApiAIHandler {

    constructor() {

        router.post('/webhook', (req,res) => {

            console.log('Received POST request.',req.body);

            const city = req.body.result.parameters['geo-city'];
            const date = req.body.result.parameters['date'];

            if(date == '')
                date = 'today';
            
            res.json({
                'speech':" Weather for " + date + " in " + city + "? Probably it is sunny.",
                'displayText':" Weather for " + date + " in " + city + "? Probably it is sunny.",
            })

        });

        this.router = router;

    }

}

module["exports"] = ApiAIHandler;