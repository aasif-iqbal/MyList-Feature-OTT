import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import myListRoutes from './routes/mylist.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', myListRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));