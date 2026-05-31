import express from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

const router = express.Router();

// Use memory storage so we can pipe to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

router.post("/api/upload-document", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const ext = file.originalname.split(".").pop() || "bin";
    const key = `documents/${nanoid(12)}.${ext}`;
    const { url } = await storagePut(key, file.buffer, file.mimetype || "application/octet-stream");

    res.json({ key, url });
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export function registerUploadRoutes(app: express.Application) {
  app.use(router);
}
