// Imports
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import dotenv from 'dotenv';

import routes from './routes';

// DotEnv config
dotenv.config();

// Constants
const PORT = process.env.PORT || 4444;

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

export const upload = multer({ storage });

// Express config
const app = express();
app.use(cors({ credentials: true, origin: `${process.env.ORIGIN || '*'}` }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('./uploads'));

routes(app);

app.listen(PORT, () => {
  console.clear();
  console.log(`[Successfully] Server started at port ${PORT}`);
});

// MongoDB config
mongoose.connect(process.env.MONGO_URI!, () => {
  console.log(`[Successfully] MongoDB connected`);
});
