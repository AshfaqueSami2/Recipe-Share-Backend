// import dotenv from 'dotenv';
// import path from 'path';

// // Load environment variables from .env file
// dotenv.config({ path: path.join(process.cwd(), '.env') });

// // Define the configuration object with proper typing and defaults
// export default {
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
//   database_url: process.env.DATABASE_URL || '',
//   bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10,
//   jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
//   jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
//   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
//   jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
//   frontend_url: process.env.FRONTEND_URL || '',
//   reset_pass_ui_link: process.env.RESET_PASS_UI_LINK || '',
//   image_bb_api_key: process.env.IMAGEBB_API_KEY || '',
//   store_id: process.env.STORE_ID,
//   signature_key: process.env.SIGNATURE_KEY,
//   payment_url: process.env.PAYMENT_URL,
//   return_url: process.env.RETURN_URL,
//   cancel_url: process.env.CANCEL_URL,
// };

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define the configuration object with proper typing and defaults
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database_url: process.env.DATABASE_URL || '',
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    : 10,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  frontend_url: process.env.FRONTEND_URL || '',
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK || '',
  image_bb_api_key: process.env.IMAGEBB_API_KEY || '',
  store_id: process.env.STORE_ID,
  signiture_key: process.env.SIGNITURE_KEY,
  payment_url: process.env.PAYMENT_URL || 'https://sandbox.aamarpay.com/jsonpost.php',
  return_url: process.env.RETURN_URL,
  cancel_url: process.env.CANCEL_URL,
};

export default config;
