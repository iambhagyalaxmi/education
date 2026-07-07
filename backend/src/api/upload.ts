import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'education_app', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  } as any
});

const upload = multer({ storage: storage }).single('image');

// Upload Endpoint
router.post('/', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(500).json({ error: 'Image upload failed: ' + err.message });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      
      // The uploaded file details are in req.file
      // The Cloudinary URL is stored in req.file.path
      res.status(200).json({ 
        url: req.file.path,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      res.status(500).json({ error: 'Internal server error during upload' });
    }
  });
});

export default router;
