import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constant/index.js';
import fs from 'node:fs/promises';
cloudinary.v2.config({
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});
export const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.v2.uploader.upload(file.path, { folder });
  await fs.unlink(file.path);
  return response.secure_url;
};
