const express = require('express');
const router = express.Router();

class ApiAIHandler {

    constructor() {

        router.post('/webhook', (req,res) => {

            console.log('Received POST request.',req.body);

            const city = req.body.result.parameters['geo-city'];
            const date = req.body.result.parameters['date'];

            res.json({
                'speech':'Tomorrow is sunny day.',
                'displayText':'Tomorrow is sunny day.'
            })

        });

        this.router = router;

    }

}

module["exports"] = ApiAIHandler;