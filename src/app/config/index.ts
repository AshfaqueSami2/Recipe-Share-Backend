import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret:process.env.JWT_ACCESS_SECRET ,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  frontend_url:process.env.FRONTEND_URL,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
};