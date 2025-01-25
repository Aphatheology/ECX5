import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary'


// export const uploadFile = async (file: any) => {
//   return new Promise(resolve => {
    // cloudinary.uploader.upload(file, (_err: any, res: any) => {
    //   resolve({
    //     res: res.secure_url,
    //   })
    // });

//     cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
//       if (error) throw new Error(error.message);
//       return result;
//     });
//   })
// };

export const uploadFile = async (file: Express.Multer.File, folder: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      })
      .end(file.buffer);
  });
};



export const deleteFile = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(new Error(error.message));
      }

      if (result.result !== 'ok') {
        return reject(new Error('Failed to delete file from Cloudinary.'));
      }
      resolve();
    });
  });
};
