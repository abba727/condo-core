import type { Express } from "express";
import { storageGetSignedUrl } from "./storage";

/**
 * Keeps the existing file URL contract private while Cloud Storage objects stay
 * non-public. Browser requests receive a short-lived Google Cloud signed URL.
 */
export function registerStorageRoutes(app: Express) {
  app.get("/api/files/*", async (req, res) => {
    const key = decodeURIComponent((req.params as unknown as Record<string, string>)["0"] ?? "").replace(/^\/+/, "");
    if (!key || key.includes("..")) {
      res.status(400).json({ error: "Invalid file key" });
      return;
    }

    try {
      const url = await storageGetSignedUrl(key);
      res.redirect(307, url);
    } catch (error) {
      console.error("[Storage] Unable to create download URL", error);
      res.status(404).json({ error: "File not found" });
    }
  });
}
