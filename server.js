const express = require('express');
const { MongoClient } = require('mongodb'); 

//Initializing the Express app 
const app = express();
app.use(express.json());


//Request logger : logs date and time 
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleDateString()}] ${req.method} ${req.url}`);
  next();
})

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//MongoDB Connection
const uri = 'mongodb+srv://ce509:zn60iIQGQCibasri@cluster0.zhq0t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let db;

client.connect()
  .then(()  =>  {
    db = client.db('trashdb');
    console.log('Connected to Mongodb');
  })
  .catch(err => console.error('MongoDB connection error:',err));

//Save a single bin category reading sent from the device into MongoDB
app.post('/readings', async(req,res) => {
  try{
    const doc = req.body || {};

    //Validation check to not save empty data
    if (!doc.deviceId || !doc.category || typeof doc.level === 'undefined') {
      return res.status(400).json({ error: 'Invalid reading. Required deviceId, category, level'});
    }

    //Uses current date
    if (doc.date) {
      const d = new Date(doc.date);
      doc.date = isNan(d.getTime()) ? newDate() : d;
    } else  {
      doc.date = new Date();
    }
    await db.collection('readings').insertOne(doc);
    res.status(201).json({  success: true });

  }catch (err)  {
    console.error('POST /readings error', err);
    
    res.status(500).json({ error: 'Failed to save reading'});
    }
  });
  
app.get('/', (req, res) => {
  res.send('Trash Monitoring API running');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});