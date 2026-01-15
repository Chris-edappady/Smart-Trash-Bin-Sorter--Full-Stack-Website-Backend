const express = require('express');

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

app.get('/', (req, res) => {
  res.send('Trash Monitoring API running');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});