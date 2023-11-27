const express = require('express'); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
  
var app = express(); 
app.use(cors());
const PORT = 3001;

const credentials = "./credentials/X509-cert-675521902134797592.pem";
const client = new MongoClient('mongodb+srv://clusterelections.4laosul.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});

async function GetVoterInfo(nric) {
    var results;
    try {
      await client.connect();
      const database = client.db("elections_voter_data");
      const collection = database.collection("elections");
      results = await collection.findOne({id: nric});
      if (!results) {
        results = {"id": false};
      }
      return new Promise(res => {
        setTimeout(() => {
          res(results);
        }, 2000);
      })
      // perform actions using client
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function VoterRegister(nric) {
  var results;
  try {
    await client.connect();
    const database = client.db("elections_voter_data");
    const collection = database.collection("elections");
    results = await collection.updateOne({id: nric}, {"$set": {voted: true}});
    console.log(results);
    var response_data = {"inserted": false};
    if (results["modifiedCount"] === 1){
      response_data = {"inserted": true}
    };
    return new Promise(res => {
      setTimeout(() => {
        res(response_data);
      }, 2000);
    })
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
  
app.get('/', async (req, res)=>{ 
    res.status(200); 
    // res.send("Welcome to root URL of Server");
    res.set('Content-Type', 'application/json'); 
    const data = await GetVoterInfo(req.query.nric);
    console.log(data);
    if (data["id"]){
      if (data["electiion center"] === parseInt(req.query.election_center_id)){
        response = {"correct_center": true, "valid_voter": true}
      }
      else {
        response = {"correct_center": false, "valid_voter": true}
      }
    }
    else{
      response = {"correct_center": false, "valid_voter": false}
    }
    res.send(response);
}); 

app.post('/voter-register', async(req,res)=> {
  res.status(200);
  res.set('Content-Type', 'application/json');
  const data = await VoterRegister(req.query.nric);
  res.send(data);
})
  
app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 