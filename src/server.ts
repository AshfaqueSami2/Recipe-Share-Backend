import mongoose from 'mongoose';
import app from './app';
import config from './app/config';


async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      // Change port number to 8080
      console.log(`app is listening on port 5000`); // Update log message accordingly
    });
  } catch (err) {
    console.log(err);
  }
}

main();
