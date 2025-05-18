const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directory at the root level (consistent with index.js)
const uploadDir = path.join(__dirname, "..", "uploads"); // Move up one level from controller/

// Ensure the uploads directory exists (runs once on module load)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // recursive: true ensures parent dirs are created if needed
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // More unique filename
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|ico|JPEG|JPG|PNG|GIF|ICO/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png, gif,ico) and pdf are allowed"));
    }
};

// Multer middleware
const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter,
}).single("image");

// Export the uploadImage function
const uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors (e.g., file too large)
            return res.status(400).json({ error: "Upload error", details: err.message });
        }
        if (err) {
            // Other errors (e.g., file type rejection)
            return res.status(400).json({ error: "Upload error", details: err.message });
        }
        if (!req.file) {
            // No file was uploaded
            return res.status(400).json({ error: "No file uploaded" });
        }


      

        res.status(200).json({ imageUrl: req.file.filename });
    });
};

module.exports = { uploadImage };