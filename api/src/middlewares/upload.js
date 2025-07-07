const multer = require('multer');
const path = require('path');

// กำหนดตำแหน่งและชื่อไฟล์ที่จะอัปโหลด
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads'); // เก็บไฟล์ในโฟลเดอร์ src/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // ตั้งชื่อไฟล์ตามเวลา
  }
});

// ตรวจสอบประเภทไฟล์ (อนุญาตเฉพาะไฟล์รูปภาพ)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// ตั้งค่า Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ไม่เกิน 5MB
  fileFilter
});

module.exports = upload;
