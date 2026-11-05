import multer from "multer";

// Product images only, 5 MB per file. The previous config
// had no limits at all and (because the route mounted
// multer BEFORE authSeller) unauthenticated callers could
// write arbitrary files to disk — the route order is fixed
// in routes/productRoute.js; these limits are the backstop.
export const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});
