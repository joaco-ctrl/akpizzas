jest.mock('../service/productService', () => ({
    listar: jest.fn(),
    listarAdmin: jest.fn(),
    listarCategorias: jest.fn(),
    crearCategoria: jest.fn(),
    actualizarCategoria: jest.fn(),
    eliminarCategoria: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn()
}));

const productService = require('../service/productService');
const {
    actualizarCategoria,
    eliminarCategoria,
    crear,
    actualizar
} = require('../controllers/productController');

function response() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe('category controller', () => {
    beforeEach(() => {
        productService.actualizarCategoria.mockReset();
        productService.eliminarCategoria.mockReset();
        productService.crear.mockReset();
        productService.actualizar.mockReset();
    });

    test('rejects invalid category data before calling the service', () => {
        const res = response();
        actualizarCategoria({ params: { id: '0' }, body: { nombre: 'Pizzas' } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(productService.actualizarCategoria).not.toHaveBeenCalled();
    });

    test('updates category with a trimmed name', () => {
        productService.actualizarCategoria.mockImplementation((id, nombre, callback) => {
            callback(null, { affectedRows: 1 });
        });
        const res = response();
        actualizarCategoria({ params: { id: '4' }, body: { nombre: '  Pizzas  ' } }, res);

        expect(productService.actualizarCategoria).toHaveBeenCalledWith(4, 'Pizzas', expect.any(Function));
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Categoría actualizada correctamente',
            id: 4,
            nombre: 'Pizzas'
        });
    });

    test('returns a conflict when deleting a category with associated products', () => {
        productService.eliminarCategoria.mockImplementation((id, callback) => {
            callback({ code: 'ER_ROW_IS_REFERENCED_2' });
        });
        const res = response();
        eliminarCategoria({ params: { id: '4' } }, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No se puede eliminar una categoría que tiene productos asociados.'
        });
    });

    test('returns not found when the category does not exist', () => {
        productService.eliminarCategoria.mockImplementation((id, callback) => {
            callback(null, { affectedRows: 0 });
        });
        const res = response();
        eliminarCategoria({ params: { id: '4' } }, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('stores the uploaded image path when creating a product', () => {
        productService.crear.mockImplementation((product, callback) => {
            expect(product.precio).toBe(100);
            expect(product.categoria_id).toBe(1);
            expect(product.disponible).toBe(1);
            expect(product.imagen_url).toBe('/img/uuid.jpg');
            callback(null, { insertId: 12 });
        });
        const res = response();
        crear({
            body: { nombre: 'Pizza', precio: '100', categoria_id: '1', disponible: '1' },
            file: { filename: 'uuid.jpg' }
        }, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('uses the newly uploaded image when updating a product', () => {
        productService.actualizar.mockImplementation((id, product, callback) => {
            expect(id).toBe(12);
            expect(product.imagen_url).toBe('/img/new-image.webp');
            callback(null, { affectedRows: 1, exists: true, previousImageUrl: 'https://example.com/old.jpg' });
        });
        const res = response();
        actualizar({
            params: { id: '12' },
            body: { nombre: 'Pizza', precio: '100', categoria_id: '1', disponible: '1' },
            file: { filename: 'new-image.webp' }
        }, res);

        expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto actualizado correctamente' });
    });
});
