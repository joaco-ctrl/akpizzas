-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-11-2026 a las 15:48:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `akpizzas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(4, 'Bebidas'),
(3, 'Empanadas'),
(7, 'frtsus'),
(8, 'jfjfjfjf'),
(2, 'Pizzas Especiales'),
(1, 'Pizzas Tradicionales'),
(5, 'Postres');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(10, 3, 6, 4, 2500.00, 10000.00),
(14, 4, 7, 5, 3200.00, 16000.00),
(19, 5, 6, 3, 2500.00, 7500.00),
(22, 6, 3, 3, 9800.00, 29400.00),
(23, 6, 6, 1, 2500.00, 2500.00),
(24, 7, 7, 3, 3200.00, 9600.00),
(25, 8, 7, 3, 3200.00, 9600.00),
(26, 9, 5, 2, 1100.00, 2200.00),
(28, 10, 2, 1, 9500.00, 9500.00),
(29, 10, 1, 1, 8500.00, 8500.00),
(30, 10, 3, 1, 9800.00, 9800.00),
(31, 10, 7, 1, 300.00, 300.00),
(32, 10, 6, 1, 2500.00, 2500.00),
(33, 10, 5, 1, 1100.00, 1100.00),
(34, 10, 4, 1, 1200.00, 1200.00),
(35, 11, 6, 2, 2500.00, 5000.00),
(36, 12, 6, 3, 2500.00, 7500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `used_at`, `created_at`) VALUES
(5, 5, '75da57c90354968cefe73fa6a2a81193e3055262fc2356e4f7e0b3d5c7e21c6a', '2026-11-27 10:53:59', '2026-11-27 10:39:23', '2026-11-27 10:38:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) NOT NULL,
  `costo_envio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `metodo_entrega` enum('DELIVERY','RETIRO_LOCAL') NOT NULL,
  `metodo_pago` enum('MERCADO_PAGO','EFECTIVO') NOT NULL,
  `estado_pedido` enum('PENDIENTE','EN_PREPARACION','LISTO','EN_CAMINO','ENTREGADO','CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
  `estado_pago` enum('PENDIENTE','APROBADO','RECHAZADO','CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
  `mercado_pago_id` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `fecha`, `subtotal`, `costo_envio`, `total`, `direccion`, `metodo_entrega`, `metodo_pago`, `estado_pedido`, `estado_pago`, `mercado_pago_id`, `created_at`, `updated_at`) VALUES
(3, 5, '2026-10-09 12:33:27', 10000.00, 0.00, 10000.00, 'sto 217', 'DELIVERY', 'EFECTIVO', 'LISTO', 'PENDIENTE', NULL, '2026-10-09 12:33:27', '2026-10-09 12:39:24'),
(4, 5, '2026-10-09 12:40:43', 16000.00, 0.00, 16000.00, 'sto 217', 'DELIVERY', 'EFECTIVO', 'EN_CAMINO', 'PENDIENTE', NULL, '2026-10-09 12:40:43', '2026-10-09 12:43:46'),
(5, 5, '2026-10-09 12:45:46', 7500.00, 0.00, 7500.00, 'sto 217', 'DELIVERY', 'EFECTIVO', 'EN_CAMINO', 'PENDIENTE', NULL, '2026-10-09 12:45:46', '2026-11-06 17:48:37'),
(6, 5, '2026-10-26 10:13:13', 31900.00, 0.00, 31900.00, 'sto 217', 'DELIVERY', 'EFECTIVO', 'CANCELADO', 'PENDIENTE', NULL, '2026-10-26 10:13:13', '2026-11-06 17:48:27'),
(7, 8, '2026-11-20 11:07:57', 9600.00, 0.00, 9600.00, 'sto 217', 'DELIVERY', 'EFECTIVO', 'LISTO', 'PENDIENTE', NULL, '2026-11-20 11:07:57', '2026-11-20 11:13:50'),
(8, 8, '2026-11-20 11:14:13', 9600.00, 0.00, 9600.00, 'dxyxyrxdyrx', 'DELIVERY', 'EFECTIVO', 'CANCELADO', 'PENDIENTE', NULL, '2026-11-20 11:14:13', '2026-11-20 11:15:25'),
(9, 5, '2026-11-27 10:44:38', 2200.00, 0.00, 2200.00, 'sto 217', 'DELIVERY', '', 'LISTO', 'PENDIENTE', NULL, '2026-11-27 10:44:38', '2026-11-27 10:48:55'),
(10, 5, '2026-11-27 10:45:24', 32900.00, 0.00, 32900.00, 'sto 217', 'DELIVERY', 'EFECTIVO', 'LISTO', 'PENDIENTE', NULL, '2026-11-27 10:45:24', '2026-11-27 10:48:49'),
(11, 5, '2026-11-27 11:00:43', 5000.00, 0.00, 5000.00, 'sto 217', 'DELIVERY', '', 'EN_PREPARACION', 'PENDIENTE', NULL, '2026-11-27 11:00:43', '2026-11-27 11:00:57'),
(12, 5, '2026-11-27 11:01:43', 7500.00, 0.00, 7500.00, NULL, 'RETIRO_LOCAL', 'EFECTIVO', 'PENDIENTE', 'PENDIENTE', NULL, '2026-11-27 11:01:43', '2026-11-27 11:05:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `categoria_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `imagen_url`, `disponible`, `categoria_id`, `created_at`, `updated_at`) VALUES
(1, 'Pizza Mozzarella', 'Masa artesanal, salsa de tomate, mozzarella y orégano', 8500.00, '/img/a5c15ab4-425e-42f9-b179-b2137c39145a.jpg', 1, 1, '2026-10-09 11:38:24', '2026-11-27 10:55:26'),
(2, 'Pizza Napolitana', 'Mozzarella, tomate en rodajas, ajo y albahaca fresca', 9500.00, '/img/fc6d9d46-fa5b-4c4a-bfa1-6fb4b4be06ee.jpg', 1, 1, '2026-10-09 11:38:24', '2026-11-27 10:55:19'),
(3, 'Pizza Fugazzeta', 'Mozzarella y abundante cebolla caramelizada', 9800.00, '/img/ed82d65a-bcf5-4b31-a583-edad856a273f.jpg', 1, 2, '2026-10-09 11:38:24', '2026-11-27 10:55:10'),
(4, 'Empanada de Carne', 'Carne cortada a cuchillo, cebolla y especia tradicional', 1200.00, '/img/a9faaa7f-0955-45a4-8c7a-3f01ffca52c8.jpg', 1, 3, '2026-10-09 11:38:24', '2026-11-27 10:55:00'),
(5, 'Empanada de Jamón y Queso', 'Queso dabo cremoso y jamón cocido', 1100.00, '/img/55610309-6d4e-4807-9072-c46ba42cdde2.jpg', 1, 3, '2026-10-09 11:38:24', '2026-11-27 10:54:52'),
(6, 'Coca-Cola 1.5L', 'Gaseosa Coca-Cola Sabor Original 1.5 Litros', 2500.00, '/img/2a688561-a5e9-4b44-a162-b6250d446596.webp', 1, 4, '2026-10-09 11:38:24', '2026-11-27 10:54:44'),
(7, 'Tiramisú', 'Postre individual de café y queso mascarpone', 300000.00, '/img/1054bbd7-2b28-49b5-b69e-938ab300f6a2.jpg', 1, 5, '2026-10-09 11:38:24', '2026-11-27 11:09:25'),
(8, 'jyjkty', '11', 11.00, NULL, 0, 4, '2026-11-20 10:50:05', '2026-11-20 11:02:17'),
(9, 'lkj{lkh', NULL, 678.00, NULL, 1, 8, '2026-11-27 11:35:40', '2026-11-27 11:35:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `rol` enum('user','admin') NOT NULL DEFAULT 'user',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `password`, `telefono`, `direccion`, `rol`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'admin@akpizzas.com', '$2b$10$Rgpf6YPjx0ob4WcdDg/D4OjbHkyWruxijoal68RZGzOhS2gT/y0Dq', '', '', 'admin', 1, '2026-09-04 12:12:08', '2026-09-04 12:13:18'),
(2, 'Juan', 'perez', 'user@akpizzas.com', '$2b$10$csPluju3V9hvEGB5CV/ZeO6rmd1Y6Uf6zAo0ANGvpWx958aVjuE2G', NULL, NULL, 'user', 1, '2026-09-07 11:51:56', '2026-09-07 11:51:56'),
(5, 'Pruebas', '1', 'pruebas.ctrl@gmail.com', '$2b$10$k0FO/26nZzeOVdvecxc9/eP24FFT.tyKushkXejf4xjr6Sc5ut9F6', '1234', NULL, 'user', 1, '2026-10-09 12:33:06', '2026-11-27 10:44:24'),
(8, 'Pruebas', 'Pruebas', 'pruebas@akpizzas.com', '$2b$10$tzJm3pvDoychR6hGiv3T0uE8VpWGQCeSlYjZd23qgh4CIopyudaS2', '1234', NULL, 'user', 1, '2026-11-20 11:07:11', '2026-11-20 11:07:11');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_detalle_pedido_producto` (`pedido_id`,`producto_id`),
  ADD KEY `idx_detalle_pedido` (`pedido_id`),
  ADD KEY `idx_detalle_producto` (`producto_id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_password_reset_tokens_token_hash` (`token_hash`),
  ADD KEY `idx_password_reset_tokens_user_used` (`user_id`,`used_at`),
  ADD KEY `idx_password_reset_tokens_expires_at` (`expires_at`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mercado_pago_id` (`mercado_pago_id`),
  ADD KEY `idx_pedidos_usuario` (`usuario_id`),
  ADD KEY `idx_pedidos_estado_pedido` (`estado_pedido`),
  ADD KEY `idx_pedidos_estado_pago` (`estado_pago`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_productos_categoria` (`categoria_id`),
  ADD KEY `idx_productos_disponible` (`disponible`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_activo` (`activo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `fk_detalle_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_password_reset_tokens_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
