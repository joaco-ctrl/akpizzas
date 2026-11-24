const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const imageDirectory = path.join(__dirname, '..', '..', 'public', 'img');
const allowedFormats = {
    '.jpeg': new Set(['image/jpeg']),
    '.jpg': new Set(['image/jpeg', 'image/jpg']),
    '.png': new Set(['image/png']),
    '.gif': new Set(['image/gif']),
    '.webp': new Set(['image/webp'])
};

fs.mkdirSync(imageDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, imageDirectory),
    filename: (_req, file, callback) => {
        callback(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const mimeTypes = allowedFormats[extension];
        if (mimeTypes?.has(file.mimetype.toLowerCase())) {
            return callback(null, true);
        }
        const error = new Error('La imagen debe ser JPEG, JPG, PNG, GIF o WEBP.');
        error.code = 'INVALID_IMAGE_TYPE';
        callback(error);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

function uploadProductImage(req, res, next) {
    upload.single('imagen')(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'La imagen no puede superar los 5 MB.' });
        }
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: 'No se pudo procesar el archivo de imagen.' });
        }
        if (error.code === 'INVALID_IMAGE_TYPE') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    });
}

function removeFile(filename) {
    if (!filename || path.basename(filename) !== filename) return;
    fs.unlink(path.join(imageDirectory, filename), (error) => {
        if (error && error.code !== 'ENOENT') {
            console.error('No se pudo eliminar una imagen de producto:', error.message);
        }
    });
}

function removeUploadedProductImage(file) {
    if (file) removeFile(file.filename);
}

function removeLocalProductImage(imageUrl) {
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith('/img/')) return;
    removeFile(imageUrl.slice('/img/'.length));
}

function getUploadedProductImageUrl(file) {
    return file ? `/img/${file.filename}` : null;
}

module.exports = {
    uploadProductImage,
    getUploadedProductImageUrl,
    removeUploadedProductImage,
    removeLocalProductImage
};
