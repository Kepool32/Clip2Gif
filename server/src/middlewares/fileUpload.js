const multer = require('multer');
const path = require('path');
const fs = require('fs');


const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 768 },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Error: Video files only!'));
    }
  },
});

module.exports = upload;
