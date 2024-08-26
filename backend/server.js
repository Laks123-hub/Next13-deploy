const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
