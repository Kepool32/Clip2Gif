const Queue = require('bull');
const { convertVideoToGif } = require('../services/conversionService');
require('dotenv').config();

const videoQueue = new Queue('video conversion', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  limiter: {
    max: parseInt(process.env.QUEUE_MAX, 10) || 1000,
    duration: parseInt(process.env.QUEUE_DURATION, 10) || 60000,
  },
});

videoQueue.process(async (job) => {
  const { filePath } = job.data;

  try {
    const outputFile = await convertVideoToGif(filePath);
    return outputFile;
  } catch (error) {
    throw new Error(`Failed to convert video: ${error.message}`);
  }
});

videoQueue.on('completed', async (job, outputFile) => {
  const { res } = job.data;
  if (res) {
    res.download(outputFile, async (err) => {
      if (err) {
        return res.status(500).send('Error downloading the file.');
      }

      try {
        await fsPromises.unlink(outputFile);
        console.log(`Output file deleted: ${outputFile}`);
      } catch (unlinkErr) {
        console.error('Error deleting output file:', unlinkErr);
      }
    });
  }
});

videoQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = videoQueue;
