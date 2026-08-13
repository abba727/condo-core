import { Storage } from "@google-cloud/storage";

function getBucket() {
  const bucketName = process.env.GCS_BUCKET;
  if (!bucketName) throw new Error("Storage config missing: set GCS_BUCKET");
  return new Storage().bucket(bucketName);
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  await getBucket().file(key).save(data, { resumable: false, contentType });
  return { key, url: `/api/files/${encodeURIComponent(key).replace(/%2F/g, "/")}` };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/api/files/${encodeURIComponent(key).replace(/%2F/g, "/")}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const key = normalizeKey(relKey);
  const [url] = await getBucket().file(key).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
  });
  return url;
}
