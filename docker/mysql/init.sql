CREATE DATABASE IF NOT EXISTS Proyecto_ruta;
USE Proyecto_ruta;

-- =========================
-- ROLES
-- =========================

CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE
);

-- =========================
-- USERS (login)
-- =========================

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES rol(id_rol),
    INDEX idx_users_rol (rol_id)
);

-- =========================
-- CLIENTE (perfil usuario)
-- =========================

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido1 VARCHAR(150) NOT NULL,
    apellido2 VARCHAR(150),
    provincia VARCHAR(100) NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    INDEX idx_cliente_user (user_id)
);

-- =========================
-- RUTAS
-- =========================

CREATE TABLE ruta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    publicada BOOLEAN DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    INDEX idx_ruta_user (user_id)
);

-- =========================
-- PARADAS DE RUTA
-- =========================

CREATE TABLE parada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    orden INT NOT NULL,
    latitud DECIMAL(10,7) NOT NULL,
    longitud DECIMAL(10,7) NOT NULL,
    tipo_transporte ENUM('coche','andando') NOT NULL,
    tiempo_estimado INT,
    distancia_estimada DECIMAL(10,2),
    FOREIGN KEY (ruta_id) REFERENCES ruta(id),
    INDEX idx_parada_ruta (ruta_id)
);

-- =========================
-- SERVICIOS CERCANOS
-- =========================

CREATE TABLE servicio_cercano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parada_id INT NOT NULL,
    tipo ENUM('gasolinera','tienda','area_descanso') NOT NULL,
    nombre VARCHAR(100),
    distancia DECIMAL(10,2),
    FOREIGN KEY (parada_id) REFERENCES parada(id),
    INDEX idx_servicio_parada (parada_id)
);

-- =========================
-- PUBLICACIONES
-- =========================

CREATE TABLE publicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ruta_id INT NULL,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    FOREIGN KEY (ruta_id) REFERENCES ruta(id),
    INDEX idx_publicacion_user (user_id),
    INDEX idx_publicacion_ruta (ruta_id)
);

-- =========================
-- COMENTARIOS
-- =========================

CREATE TABLE comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT NOT NULL,
    user_id INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicacion(id),
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    INDEX idx_comentario_publicacion (publicacion_id),
    INDEX idx_comentario_user (user_id)
);

-- =========================
-- CHAT
-- =========================

CREATE TABLE chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id_user),
    FOREIGN KEY (user2_id) REFERENCES users(id_user),
    UNIQUE(user1_id, user2_id),
    INDEX idx_chat_user1 (user1_id),
    INDEX idx_chat_user2 (user2_id)
);

-- =========================
-- MENSAJES
-- =========================

CREATE TABLE mensaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    INDEX idx_mensaje_chat (chat_id),
    INDEX idx_mensaje_user (user_id)
);