// Upload รูปภาพ
exports.uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    res.status(201).json({
      message: 'Image uploaded successfully',
      filePath: `/uploads/${req.file.filename}` // ส่ง path กลับไป
    });
  };
  