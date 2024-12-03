const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const convertVideoToGif = (inputFile) => {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(inputFile)) {
      return reject(new Error(`Input file does not exist: ${inputFile}`));
    }

    const outputDir = path.join(__dirname, '../../output');
    const outputFile = path.join(outputDir, `${Date.now()}.gif`);


    ffmpeg(inputFile)
        .outputOptions([
          '-pix_fmt rgb24',
          '-vf fps=5,scale=-1:400',
          '-t 10',
          '-f gif',
        ])
        .on('start', (command) => {
          console.log(`Spawned FFmpeg with command: ${command}`);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', () => {
          console.log(`Conversion completed: ${outputFile}`);
          resolve(outputFile);
        })
        .on('error', (err) => {
          console.error(`Error during conversion: ${err.message}`);
          reject(err);
        })
        .save(outputFile);
  });
};

module.exports = { convertVideoToGif };
