//TODO will fix this functions later!!
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const fileFormatFilter = (_req: any, file: any, callback: any) => {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|docx|pptx)$/)) {
    callback(null, true);
  } else {
    return callback(
      new BadRequestException(
        `Unsupported file type ${extname(file.originalname)}`,
      ),
      false,
    );
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
