import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';
const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};
bootstrap();
// mongodb+srv://bliznyukyaroslav1999:sZSDp1KL0Kr8CdZs@cluster0.utuj3wa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
