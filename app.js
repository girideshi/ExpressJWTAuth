const express = require('express');
const jwt = require('jsonwebtoken');

const port = 3200;

const app = express();

app.listen(port, () => { console.log(`app listening on port ${port}`)});

app.get('/api', (req, res) => {
    res.json({
        Message: 'Welcome to Token based authentication!'
    })
});

app.get('/api/getAll', VerifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.json({
                error: 'You are not authorized to access!'
            });
        }else{
            res.json({
                Message: 'GetAll succeeded',
                authData
            });
        }
    });

});

app.post('/api/create', VerifyToken, (req, res) => {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        console.log(err);
        if(err){
            res.sendStatus(403);
        }
        else{
            res.json({
                Message: 'HTTP POST with authentication, Resource Created Successfully!',
                authData
            });
        }
    });
    
});

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        Id:1,
        username:'giri',
        email:'giri@giri.com'
    }
    console.log(user);
    
    jwt.sign({user}, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });
});

function VerifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        console.log(bearerToken);
    }
    else{
        res.json({
            Error: 'You are not authorized!'
            
        });
    }
    
    

    next();
}

