import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, async () => {
  console.log(`🚀 Profile Service running on port ${PORT}`);
  
  console.log('📡 Listening for HTTP orchestration from BFF');
});