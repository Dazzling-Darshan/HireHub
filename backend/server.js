import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import authRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.route.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';
import path from "path";



dotenv.config();

const app = express();

const _dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ["https://job-portal-8j14.onrender.com", "http://localhost:5173"],
    credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/company",companyRoutes);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/application",applicationRoutes);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });