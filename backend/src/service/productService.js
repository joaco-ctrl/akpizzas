const conexion = require('../config/database');

function listar(callback) {
    const query = `SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        INNER JOIN categorias c ON c.id = p.categoria_id
        WHERE p.disponible = 1
        ORDER BY p.id DESC`;
    conexion.query(query, callback);
}

function listarAdmin(callback) {
    const query = `SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        INNER JOIN categorias c ON c.id = p.categoria_id
        ORDER BY p.disponible DESC, p.id DESC`;
    conexion.query(query, callback);
}

function listarCategorias(callback) {
    conexion.query('SELECT id, nombre FROM categorias ORDER BY nombre', callback);
}

function crearCategoria(nombre, callback) {
    conexion.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], callback);
}

function actualizarCategoria(id, nombre, callback) {
    conexion.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id], (error, resultado) => {
        if (error) return callback(error);
        if (resultado.affectedRows) return callback(null, resultado);

        conexion.query('SELECT id FROM categorias WHERE id = ?', [id], (lookupError, categorias) => {
            if (lookupError) return callback(lookupError);
            callback(null, { ...resultado, exists: categorias.length > 0 });
        });
    });
}

function eliminarCategoria(id, callback) {
    conexion.query('DELETE FROM categorias WHERE id = ?', [id], callback);
}

function crear(data, callback) {
    const { nombre, descripcion, precio, imagen_url, categoria_id } = data;
    const query = `INSERT INTO productos
        (nombre, descripcion, precio, imagen_url, categoria_id)
        VALUES (?, ?, ?, ?, ?)`;
    conexion.query(query, [nombre, descripcion || null, precio, imagen_url || null, categoria_id], callback);
}

function actualizar(id, data, callback) {
    const { nombre, descripcion, precio, imagen_url, categoria_id, disponible } = data;
    const query = `UPDATE productos
        SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, categoria_id = ?, disponible = ?
        WHERE id = ?`;
    conexion.query('SELECT id, imagen_url FROM productos WHERE id = ?', [id], (lookupError, productos) => {
        if (lookupError) return callback(lookupError);
        if (!productos.length) return callback(null, { affectedRows: 0, exists: false });
        const previousImageUrl = productos[0].imagen_url;
        conexion.query(query, [nombre, descripcion || null, precio, imagen_url || null, categoria_id, disponible === undefined ? 1 : disponible, id], (error, resultado) => {
            if (error) return callback(error);
            callback(null, { ...resultado, exists: true, previousImageUrl });
        });
    });
}

function eliminar(id, callback) {
    conexion.query('UPDATE productos SET disponible = 0 WHERE id = ?', [id], callback);
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