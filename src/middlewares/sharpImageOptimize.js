const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const imageOptimize = async (req, res, next) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (!req.files && !req.file) {
      return next();
    }

    // Handle single file upload
    if (req.file) {
      const optimizedBuffer = await sharp(req.file.buffer)
        .webp({
          quality: 80,
          effort: 6,
        })
        .toBuffer();

      // Generate unique filename
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
      const filepath = path.join(uploadsDir, filename);

      // Write file to disk
      fs.writeFileSync(filepath, optimizedBuffer);

      // Update file properties
      req.file.buffer = optimizedBuffer;
      req.file.size = optimizedBuffer.length;
      req.file.mimetype = "image/webp";
      req.file.path = filepath;
      req.file.filename = filename;
    }

    if (req.files) {
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        const filesArray = Array.isArray(files) ? files : [files];

        for (let i = 0; i < filesArray.length; i++) {
          const file = filesArray[i];

          if (!file.mimetype.startsWith("image/")) {
            continue;
          }

          const optimizedBuffer = await sharp(file.buffer)
            .resize({
              width: 1200,
              height: 1200,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({
              quality: 80,
              effort: 6,
            })
            .toBuffer();

          // Generate unique filename
          const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
          const filepath = path.join(uploadsDir, filename);

          // Write file to disk
          fs.writeFileSync(filepath, optimizedBuffer);

          // Update file properties
          file.buffer = optimizedBuffer;
          file.size = optimizedBuffer.length;
          file.mimetype = "image/webp";
          file.path = filepath;
          file.filename = filename;
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = imageOptimize;
