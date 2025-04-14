const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const cors = require('cors')

const port = 3001;
const app = express();

app.use(cors())
// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(bodyParser.json()); // Parse JSON

// API routes
app.use('/api', api);

// Start server
app.listen(port, () => {
    console.log(` Server is running at http://localhost:${port}`);
});
