const express = require('express');
const router = express.Router();

class ApiAIHandler {

    constructor() {

        router.post('/webhook', (req,res) => {

            console.log('Received POST request.',req.body);

        });

        this.router = router;

    }

}

module["exports"] = ApiAIHandler;