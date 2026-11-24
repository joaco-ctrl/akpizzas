const productService = require('../service/productService');
const {
    getUploadedProductImageUrl,
    removeLocalProductImage,
    removeUploadedProductImage
} = require('../middlewares/uploadProductImage');

function getProductData(req) {
    const data = {
        ...(req.body || {}),
        imagen_url: req.file ? getUploadedProductImageUrl(req.file) : req.body?.imagen_url
    };
    for (const field of ['precio', 'categoria_id']) {
        if (typeof data[field] === 'string' && data[field].trim()) {
            data[field] = Number(data[field]);
        }
    }
    if (typeof data.disponible === 'string') {
        const availability = data.disponible.trim().toLowerCase();
        if (availability === '0' || availability === '1') data.disponible = Number(availability);
        if (availability === 'true' || availability === 'false') data.disponible = availability === 'true';
    }
    return data;
}

function listar(req, res) {
    productService.listar((error, productos) => {
        if (error) return res.status(500).json({ error: 'Error al obtener productos' });
        res.json(productos);
    });
}

function listarAdmin(req, res) {
    productService.listarAdmin((error, productos) => {
        if (error) return res.status(500).json({ error: 'Error al obtener productos' });
        res.json(productos);
    });
}

function listarCategorias(req, res) {
    productService.listarCategorias((error, categorias) => {
        if (error) return res.status(500).json({ error: 'Error al obtener categorías' });
        res.json(categorias);
    });
}

function crearCategoria(req, res) {
    const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
    if (!nombre || nombre.length > 100) {
        return res.status(400).json({ error: 'El nombre de la categoría es obligatorio y no puede superar 100 caracteres.' });
    }
    productService.crearCategoria(nombre, (error, resultado) => {
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe una categoría con ese nombre.' });
        }
        if (error) return res.status(500).json({ error: 'No se pudo crear la categoría.' });
        res.status(201).json({ id: resultado.insertId, nombre });
    });
}

function actualizarCategoria(req, res) {
    const id = Number(req.params.id);
    const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
    if (!Number.isInteger(id) || id < 1 || !nombre || nombre.length > 100) {
        return res.status(400).json({ error: 'Los datos de la categoría no son válidos.' });
    }
    productService.actualizarCategoria(id, nombre, (error, resultado) => {
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe una categoría con ese nombre.' });
        }
        if (error) return res.status(500).json({ error: 'No se pudo actualizar la categoría.' });
        if (!resultado.affectedRows && !resultado.exists) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.json({ mensaje: 'Categoría actualizada correctamente', id, nombre });
    });
}

function eliminarCategoria(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'La categoría no es válida.' });
    }
    productService.eliminarCategoria(id, (error, resultado) => {
        if (error?.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'No se puede eliminar una categoría que tiene productos asociados.' });
        }
        if (error) return res.status(500).json({ error: 'No se pudo eliminar la categoría.' });
        if (!resultado.affectedRows) return res.status(404).json({ error: 'Categoría no encontrada.' });
        res.json({ mensaje: 'Categoría eliminada correctamente' });
    });
}

function validarProducto(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
    const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
    const precio = data.precio;
    const categoriaId = data.categoria_id;
    const descripcionValida = data.descripcion == null || typeof data.descripcion === 'string';
    const imagen = data.imagen_url == null ? '' : String(data.imagen_url).trim();
    const imagenValida = !imagen || imagen.length <= 255 &&
        (imagen.startsWith('/') || /^https?:\/\/\S+$/i.test(imagen));
    const disponibleValido = data.disponible === undefined ||
        [0, 1, false, true].includes(data.disponible);

    if (!nombre || nombre.length > 150 || !descripcionValida || typeof precio !== 'number' ||
        !Number.isFinite(precio) || precio <= 0 || precio > 99999999.99 ||
        !Number.isInteger(categoriaId) || categoriaId < 1 || !imagenValida || !disponibleValido) {
        return null;
    }
    return {
        ...data,
        nombre,
        precio,
        categoria_id: categoriaId,
        imagen_url: imagen || null,
        disponible: data.disponible === undefined || data.disponible === true || data.disponible === 1 ? 1 : 0
    };
}

function crear(req, res) {
    const producto = validarProducto(getProductData(req));
    if (!producto) {
        removeUploadedProductImage(req.file);
        return res.status(400).json({ error: 'Los datos del producto no son válidos' });
    }
    productService.crear(producto, (error, resultado) => {
        if (error) removeUploadedProductImage(req.file);
        if (error?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ya existe un producto con esos datos.' });
        if (error?.code === 'ER_NO_REFERENCED_ROW_2' || error?.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
            return res.status(400).json({ error: 'La categoría o el precio del producto no son válidos.' });
        }
        if (error) return res.status(500).json({ error: 'No se pudo crear el producto.' });
        res.status(201).json({ mensaje: 'Producto creado correctamente', id: resultado.insertId });
    });
}

function actualizar(req, res) {
    const id = Number(req.params.id);
    const producto = validarProducto(getProductData(req));
    if (!Number.isInteger(id) || id < 1 || !producto) {
        removeUploadedProductImage(req.file);
        return res.status(400).json({ error: 'Los datos del producto no son válidos' });
    }
    productService.actualizar(id, producto, (error, resultado) => {
        if (error || !resultado.exists) removeUploadedProductImage(req.file);
        if (error?.code === 'ER_NO_REFERENCED_ROW_2' || error?.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
            return res.status(400).json({ error: 'La categoría o el precio del producto no son válidos.' });
        }
        if (error) return res.status(500).json({ error: 'Error al actualizar el producto' });
        if (!resultado.affectedRows && !resultado.exists) return res.status(404).json({ error: 'Producto no encontrado' });
        if (resultado.previousImageUrl !== producto.imagen_url) {
            removeLocalProductImage(resultado.previousImageUrl);
        }
        res.json({ mensaje: 'Producto actualizado correctamente' });
    });
}

function eliminar(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'El producto no es válido' });
    productService.eliminar(id, (error, resultado) => {
        if (error) return res.status(500).json({ error: 'Error al eliminar producto' });
        if (!resultado.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto eliminado correctamente' });
    });
}

module.exports = {
    listar,
    listarAdmin,
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    crear,
    actualizar,
    eliminar
};