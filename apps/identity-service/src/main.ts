import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Identity Service running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/docs`);

});