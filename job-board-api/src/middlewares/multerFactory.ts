import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { UploadApiOptions } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'resumes',
//     allowed_formats: ['pdf', 'doc', 'docx'],
//     resource_type: 'raw',
//   },
// });

// const upload = multer({ storage });

// export default upload;

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })

// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

//   if (allowedFormats.includes(file.mimetype)) {
//     cb(null, true)
//   } else {
//     cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only PDF files are allowed'));
//   }
// }

// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1 * 1024 * 1024, 
//   },
// })

// export default upload;

export const multerFactory = ({
  allowedFormats,
  maxFileSize,
}: {
  allowedFormats: string[];
  maxFileSize: number;
}) => {
  const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`));
    }
  };

  return multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });
};

