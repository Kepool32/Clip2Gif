const express = require('express');
const cors = require('cors');
const videoRoutes = require('./src/routes/conversionRouters');
const { PORT } = require('./config');

const app = express();
app.use(cors());

app.use('/api', videoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
