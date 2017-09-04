const express = require('express');
const router = express.Router();

class ApiAIHandler {

    constructor() {

        router.post('/webhook', (req,res) => {

            const city = req.body.parameters['geo-city'];
            const date = req.body.parameters['date'];

            console.log('Received POST request.',req.body);
            
            res.json({
                'speech':'Tomorrow is sunny day.',
                'displayText':'Tomorrow is sunny day.'
            })

        });

        this.router = router;

    }

}

module["exports"] = ApiAIHandler;