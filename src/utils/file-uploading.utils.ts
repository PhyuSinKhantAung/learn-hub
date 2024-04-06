//TODO will fix this functions later!!
import { extname } from 'path';

export const fileFormatFilter = (_req: any, file: any, callback: any) => {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    callback(null, true);
  } else {
    return callback(new Error('Only right file formats are allowed!'), false);
  }
};

export const getFilename = (_req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
