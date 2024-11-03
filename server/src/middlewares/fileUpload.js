const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 768 },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv|video/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      const filePath = path.join(__dirname, '../uploads/', file.filename);
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('Error getting video metadata:', err);
          return cb(new Error('Error processing video file.'));
        }

        const duration = metadata.format.duration;
        console.log(`Video duration: ${duration} seconds`);

        if (duration > 10) {
          return cb(new Error('Video too long. Maximum duration: 10 seconds.'));
        }

        cb(null, true);
      });
    } else {
      cb(new Error('Error: Video files only!'));
    }
  },
});

module.exports = upload;
