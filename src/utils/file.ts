import { Request } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const initFolder = () => {
  const uploadFolderPath = path.resolve('uploads');
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true //Mục đích là tạo folder nested
    });
  }
};

export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024, // 300KB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'));
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any);
      }
      return valid;
    }
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!files.image) {
        return reject(new Error('File is empty'));
      }
      resolve(files);
    });
  });
};