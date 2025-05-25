const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRouter = require('./assistantRouter.js');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', chatRouter);

// Health check route
app.get('/', (_, res) => {
    res.send('StrideWalk FAQ Bot API is running.');
});

app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});
