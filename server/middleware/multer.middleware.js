import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage, limits: { fileSize: 1 * 1000 * 1000 } });

export default upload;