const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory for banners exists
const uploadDir = path.join(__dirname, '../../public/images/banners');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const bannerId = req.params.id || 'banner';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${bannerId}-${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)!'));
  }
};

const uploadBanner = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for banner images
  },
  fileFilter: fileFilter
});

module.exports = uploadBanner;
