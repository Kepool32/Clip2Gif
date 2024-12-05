const express = require('express');
const upload = require('../middlewares/fileUpload');
const { convertVideo, getConvertedGif} = require('../controllers/conversionController');

const router = express.Router();

router.post('/convert', upload.single('video'), convertVideo);

router.get('/convert/gif/:jobId', getConvertedGif);

module.exports = router;
