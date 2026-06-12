const sharp = require('sharp');
const path = require('path');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }
    
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.webp';
    const filepath = path.join(__dirname, '../uploads', filename);

    // Compress, resize and convert to webp
    await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    const fileUrl = `/uploads/${filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFile };
