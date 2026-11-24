const express = require('express');
const request = require('supertest');
const { uploadProductImage } = require('../middlewares/uploadProductImage');

const app = express();
app.post('/upload', uploadProductImage, (_req, res) => res.sendStatus(204));

describe('product image upload middleware', () => {
    test('rejects unsupported image types', async () => {
        const response = await request(app)
            .post('/upload')
            .attach('imagen', Buffer.from('not an image'), {
                filename: 'document.txt',
                contentType: 'text/plain'
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'La imagen debe ser JPEG, JPG, PNG, GIF o WEBP.' });
    });

    test('rejects image files larger than 5 MB', async () => {
        const response = await request(app)
            .post('/upload')
            .attach('imagen', Buffer.alloc(5 * 1024 * 1024 + 1), {
                filename: 'large.jpg',
                contentType: 'image/jpeg'
            });

        expect(response.status).toBe(413);
        expect(response.body).toEqual({ error: 'La imagen no puede superar los 5 MB.' });
    });
});
