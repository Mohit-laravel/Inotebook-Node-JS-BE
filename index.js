const connectToMongo = require('./db');
const express = require('express')
const app = express()
const port = 8000
var cors = require('cors')  

app.use(cors());

connectToMongo();

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
