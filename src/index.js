import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constant/index.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};
bootstrap();
// mongodb+srv://bliznyukyaroslav1999:sZSDp1KL0Kr8CdZs@cluster0.utuj3wa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
