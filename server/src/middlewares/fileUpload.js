const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 768 },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv|video/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    console.log(`Uploaded file: ${file.originalname}`);
    console.log(`File mimetype: ${file.mimetype}`);

    if (mimetype || extname) {
      console.log('File is valid.');
      return cb(null, true);
    }
    console.error('Invalid file type.');
    cb('Error: Video files only!');
  },
});

module.exports = upload;
