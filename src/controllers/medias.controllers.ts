import { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';
import path from 'path';
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import mediasService from '~/services/medias.services';
import mime from 'mime';

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadImage(req);
  return res.json({ result: url, message: USERS_MESSAGES.UPLOAD_SUCCESS });
};

export const uploadVideoController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadVideo(req);
  return res.json({ result: url, message: USERS_MESSAGES.UPLOAD_SUCCESS });
};

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params;
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found');
    }
  });
};

export const serveStreamVideoController = async (req: Request, res: Response) => {
  const { range } = req.headers;
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Required range header');
  }
  const { name } = req.params;
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name);

  //NOTE:
  /**
   *1MB=10^6 bytes ( Tính theo hệ 10, đây là thứ mà chúng ta hay thấy trên UI)
   *Còn nếu tính theo hệ nhị phân thì 1MB=2^20 bytes ( 1024*1024 )
   */

  //Dung lượng Video ( bytes )
  const videoSize = statSync(videoPath).size;
  //Dung lượng video cho mỗi phân đoạn stream
  const chunkSize = 10 ** 6; //1Mb
  //Lấy giá trị byte bắt đầu từ header Range (dv: bytes:1048576-)
  const start = Number(range.replace(/\D/g, ''));
  // Lấy giá trị bute kết thúc, vượt quá dung lượng video thì lấy giá trị videoSize
  const end = Math.min(start + chunkSize, videoSize - 1);

  //Dung lượng thực tế cho mỗi video stream
  // Thường đây sẽ là chunkSize, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1;
  const contentType = mime.getType(videoPath) || 'video/*';
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  };
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers);
  const videoStreams = createReadStream(videoPath, { start, end });
  videoStreams.pipe(res);
};
