// import mongoose from 'mongoose';
// import app from './app';
// import config from './app/config';


// async function main() {
//   try {
//     await mongoose.connect(config.database_url as string);

//     app.listen(config.port, () => {
//       // Change port number to 8080
//       console.log(`app is listening on port 5000`); // Update log message accordingly
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }





// main();
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './app/config';

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url as string);

    // Create HTTP server and bind it with the Express app
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: '*', // Adjust CORS options as necessary
      },
    });

    // Handle WebSocket connections
    io.on('connection', (socket) => {
      // console.log('A user connected:', socket.id);

      // Optionally handle disconnection
      socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
      });
    });

    // Start the server and listen on the configured port
    server.listen(config.port, () => {
      // console.log(`Server running on port ${config.port}`);
    });

    // Export `io` for use in other modules
    app.set('io', io); // Attach to the app so it can be accessed globally
  } catch (error) {
    // console.error('Failed to connect to the database', error);
  }
}

main();
