const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express')
const path = require('path')

const __serverDir = path.resolve(path.dirname(''));
const __srcDir = path.join(__serverDir, "../")
console.log(__srcDir)
const app = express()

app.use(express.static("."));
app.use(express.static(__srcDir + '/jspm_packages/'));
app.use(express.static(__srcDir + '/styles/'));



//////////////////////////////////
//
//      MONGO SETUP
// 

// Connection URL
const url = 'mongodb://dbtest:dbtest@localhost:27017/dbtest';
// const url = 'mongodb://dbtest:dbtest@localhost:27017';

// Database Name
const dbName = 'dbtest';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection('dbtest');
  // collection.find({}).toArray(function (err, docs) {
  //     assert.equal(err, null);
  //     console.log("Found the following records");
  //     console.log(docs)
  // });


  client.close();
});



//////////////////////////////////
//
//      ROUTERS
// 

// src/index.html
const index = path.join(__srcDir, 'index.html')
app.get("/", function (req, res) {
  res.sendFile(index);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started")
})
