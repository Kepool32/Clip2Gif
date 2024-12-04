const Queue = require('bull');
const { convertVideoToGif } = require('../services/conversionService');
const fsPromises = require('fs').promises;
const config = require('../../config');


const videoQueue = new Queue('video conversion', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
  limiter: {
    max: config.queue.max,
    duration: config.queue.duration,
  },
});

videoQueue.process(async (job) => {
  const { filePath } = job.data;
  let res
  try {
    const outputFile = await convertVideoToGif(filePath);


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
  } catch (error) {
    throw new Error(`Failed to convert video: ${error.message}`);
  }
});

videoQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = videoQueue;
