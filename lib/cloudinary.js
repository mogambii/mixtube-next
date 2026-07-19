/**
 * Transforms a Cloudinary image URL to include automatic format and quality optimizations.
 * - f_auto: serves WebP/AVIF to supported browsers, falls back to the original format
 * - q_auto: automatically picks the best quality level (good balance of size vs. quality)
 *
 * Safe to call on any URL — non-Cloudinary URLs are returned unchanged.
 *
 * @param {string|null|undefined} url - The original image URL
 * @param {object} options - Optional overrides
 * @param {string} options.quality - e.g. "q_auto:best", "q_auto:eco" (default: "q_auto")
 * @param {string} options.width - e.g. "w_400" to also resize (default: none)
 * @returns {string} The optimized URL (or the original if not a Cloudinary URL)
 */
export function optimizeCloudinaryUrl(url, { quality = "q_auto", width } = {}) {
  if (!url || typeof url !== "string") return url;

  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  // Cloudinary transformation URLs use /upload/ as the injection point
  const uploadMarker = "/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;

  const transforms = ["f_auto", quality, width].filter(Boolean).join(",");

  const before = url.slice(0, idx + uploadMarker.length);
  const after = url.slice(idx + uploadMarker.length);

  // Avoid double-injecting if transforms already exist
  if (after.startsWith("f_auto") || after.startsWith("q_auto")) return url;

  return `${before}${transforms}/${after}`;
}
