// import axios from 'axios';
// import AppError from '../../errors/AppError';
// import config from '../../config';

// const uploadImageToImageBB = async (imageUrl: string): Promise<string> => {
//   try {
//     const apiKey = config.image_bb_api_key;

//     // Directly use the image URL for the upload
//     const response = await axios.post('https://api.imgbb.com/1/upload', null, {
//       params: {
//         key: apiKey,
//         image: imageUrl, // Send the image URL directly
//       },
//     });

//     // Check for successful response
//     if (response.data && response.data.data && response.data.data.url) {
//       return response.data.data.url; // Return the hosted image URL from ImageBB
//     } else {
//       throw new AppError(500, 'Image upload failed');
//     }
//   } catch (error) {
//     console.error('Error uploading image to ImageBB:', error.response?.data || error.message);
//     throw new AppError(500, 'Failed to upload image');
//   }
// };

// export { uploadImageToImageBB };

import axios from 'axios';
import AppError from '../../errors/AppError';
import config from '../../config';

const uploadImageToImageBB = async (imageUrl: string): Promise<string> => {
  try {
    const apiKey = config.image_bb_api_key;

    // Directly use the image URL for the upload
    const response = await axios.post('https://api.imgbb.com/1/upload', null, {
      params: {
        key: apiKey,
        image: imageUrl, // Send the image URL directly
      },
    });

    // Check for successful response
    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url; // Return the hosted image URL from ImageBB
    } else {
      throw new AppError(500, 'Image upload failed');
    }
  } catch (error) {
    // Narrow down the type of the error
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      console.error(
        'Error uploading image to ImageBB:',
        error.response?.data || error.message,
      );
      throw new AppError(500, 'Failed to upload image');
    } else if (error instanceof AppError) {
      // Re-throw AppError if caught
      throw error;
    } else {
      // Generic error handling
      console.error('Unknown error uploading image:', error);
      throw new AppError(500, 'An unknown error occurred');
    }
  }
};

export { uploadImageToImageBB };
