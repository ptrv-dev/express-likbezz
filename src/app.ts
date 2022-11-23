// Imports
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes';

// DotEnv config
dotenv.config();

// Constants
const PORT = process.env.PORT || 4444;

// Express config
const app = express();
app.use(cors());
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.clear();
  console.log(`[Successfully] Server started at port ${PORT}`);
});

// MongoDB config
mongoose.connect(process.env.MONGO_URI!, () => {
  console.log(`[Successfully] MongoDB connected`);
});
