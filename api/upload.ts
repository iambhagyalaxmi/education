import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using Environment Variables provided by Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Vercel to increase the payload size limit for base64 images if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image provided in request body.' });
      }

      // Upload the base64 string to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: 'education_app',
        resource_type: 'auto',
      });

      return res.status(200).json({ 
        url: result.secure_url,
        message: 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Error uploading image to Cloudinary:', error);
      return res.status(500).json({ error: error.message || 'Internal server error during upload' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
