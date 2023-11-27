const express = require('express'); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
  
var app = express(); 
app.use(cors());
const PORT = 3001;

app.get('/', async (req, res)=>{ 
    res.status(200); 
    // res.send("Welcome to root URL of Server");
    res.set('Content-Type', 'application/json');
    res.send("Hello world");
}); 
  
app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 