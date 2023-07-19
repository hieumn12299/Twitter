import { Request } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir';

export const initFolder = () => {
  [UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true //Mục đích là tạo folder nested
      });
    }
  });
};

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 4000 * 1024, // 4000KB
    maxTotalFileSize: 4000 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'images' && Boolean(mimetype?.includes('image/'));
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any);
      }
      return valid;
    }
  });
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!files.images) {
        return reject(new Error('File is empty'));
      }
      resolve(files.images as File[]);
    });
  });
};

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'videos' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'));
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any);
      }
      return valid;
    }
  });
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!files.videos) {
        return reject(new Error('File is empty'));
      }
      const videos = files.videos as File[];
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string);
        fs.renameSync(video.filepath, video.filepath + '.' + ext);
        video.newFilename = video.newFilename + '.' + ext;
      });
      resolve(files.videos as File[]);
    });
  });
};

export const getNameFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.');
  nameArr.pop();
  return nameArr;
};

export const getExtension = (fullName: string) => {
  const nameArr = fullName.split('.');
  return nameArr[nameArr.length - 1];
};
