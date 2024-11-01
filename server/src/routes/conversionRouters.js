const express = require('express');
const upload = require('../middlewares/fileUpload');
const { convertVideo } = require('../controllers/conversionController');

const router = express.Router();

router.post('/convert', upload.single('video'), convertVideo);

module.exports = router;
