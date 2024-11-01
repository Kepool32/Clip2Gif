const fs = require('fs');
const videoQueue = require('../queue/queue');

const convertVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFilePath = req.file.path;

  try {
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(400).send('Uploaded file does not exist.');
    }

    const job = await videoQueue.add({ filePath: uploadedFilePath });

    job
      .finished()
      .then(async (outputFile) => {
        res.download(outputFile, async (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error downloading the file.');
          } else {
            try {
              await fs.promises.unlink(outputFile);
              console.log(`Deleted converted file: ${outputFile}`);
            } catch (deleteError) {
              console.error(
                'Error deleting converted file:',
                deleteError.message
              );
            }
          }
        });

        try {
          await fs.promises.unlink(uploadedFilePath);
          console.log(`Deleted uploaded file: ${uploadedFilePath}`);
        } catch (deleteError) {
          console.error('Error deleting uploaded file:', deleteError.message);
        }
      })
      .catch((err) => {
        console.error('Job failed:', err.message);
        res.status(500).send('Conversion failed.');
      });
  } catch (error) {
    console.error('Error adding job to queue:', error.message);
    res.status(500).send('Error adding job to queue.');
  }
};

module.exports = { convertVideo };
