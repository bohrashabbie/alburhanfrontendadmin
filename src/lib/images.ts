// Resolves CMS-stored image paths into browser-loadable URLs.
//
// The CMS database holds three kinds of strings in image columns:
//   1. `http(s)://…`                → absolute URL, leave untouched
//   2. `/uploads/…`                 → served by the CMS backend (FastAPI static mount).
//                                      In dev the Vite proxy forwards /uploads to the
//                                      remote CMS, so leave it relative.
//                                      In prod we prefix with the CMS base URL.
//   3. Any other leading-slash path → legacy migrated assets that live on S3
//                                      (e.g. `/OurProject/…`). Prefix with S3 base.
//   4. Bare relative paths          → treated as CMS base + path.

const CMS_BASE = (
  (import.meta as any).env?.VITE_CMS_URL || 'http://13.60.4.75:8002'
).replace(/\/$/, '');

const S3_BASE = (
  (import.meta as any).env?.VITE_S3_BASE_URL ||
  'https://alburhan-asset.s3.eu-north-1.amazonaws.com'
).replace(/\/$/, '');

export function resolveImageUrl(path?: string | null): string | null {
  if (!path) return null;
  const p = path.trim();
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith('/uploads/')) return `${CMS_BASE}${p}`;
  if (p.startsWith('/')) return `${S3_BASE}${encodeURI(p)}`;
  return `${CMS_BASE}/${p}`;
}
