const Queue = require('bull');
const { convertVideoToGif } = require('../services/conversionService');
const fsPromises = require('fs').promises;
const config = require('../../config');
const path = require('path');


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
  const { filePath, jobId } = job.data;
  console.log(`Processing job ${jobId} with file path: ${filePath}`);

  try {
    // Конвертируем видео в GIF
    const outputFile = await convertVideoToGif(filePath);
    console.log(`Job ${jobId} completed. GIF saved to: ${outputFile}`);


    const outputFilePath = path.join(__dirname, '../../output', `${jobId}.gif`);
    await fsPromises.rename(outputFile, outputFilePath);


    return { jobId, outputFile: outputFilePath };
  } catch (error) {
    console.error(`Failed to convert video (job ${jobId}): ${error.message}`);
    throw new Error(`Failed to convert video: ${error.message}`);
  }
});

videoQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = videoQueue;
