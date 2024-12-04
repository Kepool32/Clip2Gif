const videoQueue = require('../queue/queue');
const fs = require('fs');


const convertVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFilePath = req.file.path;

  try {
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(400).send('Uploaded file does not exist.');
    }

    const job = await videoQueue.add({
      filePath: uploadedFilePath
    });

    return res.status(202).send('Video conversion in progress...');
  } catch (error) {
    console.error('Error adding job to queue:', error.message);
    return res.status(500).send('Error adding job to queue.');
  }
};


module.exports = { convertVideo };
