const express = require('express');
const cors = require('cors');
const videoRoutes = require('./src/routes/conversionRouters');
const config = require('./config');

const app = express();
app.use(cors());

app.use('/api', videoRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
