-- =============================================================================
-- 1. ESTRUCTURA DE TABLAS (DDL)
-- =============================================================================

CREATE TABLE IF NOT EXISTS centro_vacunacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    direccion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS campania (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50),
    edad_minima INT,
    edad_maxima INT
);

CREATE TABLE IF NOT EXISTS horario_centro (
    id SERIAL PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    centro_id INT REFERENCES centro_vacunacion(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tipo_vacuna (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    dosis_necesarias INT NOT NULL
);

CREATE TABLE IF NOT EXISTS stock_vacuna (
    id SERIAL PRIMARY KEY,
    campania_id INT REFERENCES campania(id) ON DELETE CASCADE,
    centro_id INT REFERENCES centro_vacunacion(id) ON DELETE CASCADE,
    tipo_vacuna_id INT REFERENCES tipo_vacuna(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vacuna (
    id SERIAL PRIMARY KEY,
    tipo_vacuna_id INT REFERENCES tipo_vacuna(id) ON DELETE CASCADE,
    stock_vacuna_id INT REFERENCES stock_vacuna(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS funcionario_salud (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    fecha_nacimiento DATE,
    preferencia_notificacion VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    centro_id INT REFERENCES centro_vacunacion(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS horario_fs (
    id SERIAL PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    funcionario_rut VARCHAR(12) REFERENCES funcionario_salud(rut) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paciente (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    fecha_nacimiento DATE,
    preferencia_notificacion VARCHAR(50),
    password VARCHAR(255) NOT NULL
);


-- =============================================================================
-- 2. INSERCIÓN DE DATOS (DML)
-- =============================================================================

-- 2.1 Campañas (Se incluye la Población Objetivo en la misma fila)
INSERT INTO campania (id, nombre, fecha_inicio, fecha_fin, descripcion, estado, edad_minima, edad_maxima) VALUES
(1, 'Campaña covid 2026', '2026-01-01', '2026-12-30', 'Campaña anual de covid', 'EN_CURSO', 18, 60),
(2, 'Campaña influenza 2026', '2026-01-01', '2026-12-30', 'Campaña anual de influenza', 'EN_CURSO', 18, 60);

ALTER SEQUENCE campania_id_seq RESTART WITH 3;

-- 2.2 Centros de Vacunación
INSERT INTO centro_vacunacion (id, nombre, tipo, direccion) VALUES
(1, 'CESFAM O''Higgins', 'CESFAM', 'Salas 538, Concepción'),
(2, 'CESFAM Víctor Manuel Fernández', 'CESFAM', 'Maipú 2120, Concepción');

ALTER SEQUENCE centro_vacunacion_id_seq RESTART WITH 3;

-- 2.3 Horarios de Centros
INSERT INTO horario_centro (dia_semana, hora_inicio, hora_fin, centro_id) VALUES
('MONDAY', '08:00:00', '18:00:00', 1),
('TUESDAY', '08:00:00', '18:00:00', 1),
('WEDNESDAY', '09:00:00', '18:00:00', 2),
('FRIDAY', '09:00:00', '15:00:00', 2);

-- 2.4 Tipos de Vacuna
INSERT INTO tipo_vacuna (id, nombre, dosis_necesarias) VALUES
(1, 'pzifer', 2),
(2, 'astrazeneca', 1),
(3, 'influvac', 1);

ALTER SEQUENCE tipo_vacuna_id_seq RESTART WITH 4;

-- 2.5 Perfiles de Stock de Vacunas
INSERT INTO stock_vacuna (id, campania_id, centro_id, tipo_vacuna_id) VALUES
(1, 1, 1, 1), -- Stock 1: Covid, CESFAM O'Higgins, Pfizer
(2, 1, 2, 2), -- Stock 2: Covid, CESFAM VMF, Astrazeneca
(3, 2, 2, 3); -- Stock 3: Influenza, CESFAM VMF, Influvac

ALTER SEQUENCE stock_vacuna_id_seq RESTART WITH 4;

-- 2.6 Funcionarios de Salud
-- Nota: Las contraseñas están pre-hasheadas con BCrypt para equivaler a 'func123'
INSERT INTO funcionario_salud (rut, nombre, apellido, telefono, email, fecha_nacimiento, preferencia_notificacion, password, centro_id) VALUES
('12345678-9', 'Carlos', 'Pérez', '912345678', 'serranosimon21@gmail.com', '1985-03-15', 'CORREOELECTRONICO', '$2a$10$9SF9VIbMwXsV0D1jGHT1jeGTeXE34rhYjUxlhXYHpa4cIUmP/l3tW', 1),
('98765432-1', 'Ana', 'González', '923738870', 'serranosimon21@gmail.com', '1990-07-20', 'SMS', '$2a$10$9SF9VIbMwXsV0D1jGHT1jeGTeXE34rhYjUxlhXYHpa4cIUmP/l3tW', 1),
('22121545-1', 'Alfredo', 'Castro', '923738870', 'serranosimon21@gmail.com', '1990-07-20', 'SMS', '$2a$10$9SF9VIbMwXsV0D1jGHT1jeGTeXE34rhYjUxlhXYHpa4cIUmP/l3tW', 2),
('21955190-3', 'Thomas', 'Sankara', '923738870', 'serranosimon21@gmail.com', '1990-07-20', 'SMS', '$2a$10$9SF9VIbMwXsV0D1jGHT1jeGTeXE34rhYjUxlhXYHpa4cIUmP/l3tW', 2);

-- 2.7 Pacientes
-- Nota: Las contraseñas están pre-hasheadas con BCrypt para equivaler a 'clave123'
INSERT INTO paciente (rut, nombre, apellido, telefono, email, fecha_nacimiento, preferencia_notificacion, password) VALUES
('7382025-1', 'María', 'López', '923738870', 'serranosimon21@gmail.com', '1995-05-10', 'AMBOS', '$2a$10$zGRad//otaAgh4N1wm2Sa.a1s0ncaeTsUF2/LJy8EXphPIM.dqeXa'),
('140349593', 'Juan', 'Martínez', '923738870', 'serranosimon21@gmail.com', '1988-11-25', 'SMS', '$2a$10$zGRad//otaAgh4N1wm2Sa.a1s0ncaeTsUF2/LJy8EXphPIM.dqeXa');


-- =============================================================================
-- 3. PROCESAMIENTO DE BUCLES COMPLEJOS (PL/pgSQL)
-- =============================================================================

DO $$
DECLARE
    i INT;
    inicio_1 TIME; fin_1 TIME;
    inicio_2 TIME; fin_2 TIME;
    inicio_3 TIME; fin_3 TIME;
    inicio_4 TIME; fin_4 TIME;
BEGIN
    -- 3.1 Generación de Horarios Fragmentados de 15 minutos para Funcionarios
    FOR i IN 0..12 LOOP
        inicio_1 := (TIME '08:00:00' + (i * 15 || ' minutes')::INTERVAL);
        fin_1    := (TIME '08:00:00' + ((i + 1) * 15 || ' minutes')::INTERVAL);
        
        inicio_2 := (TIME '12:00:00' + (i * 15 || ' minutes')::INTERVAL);
        fin_2    := (TIME '12:00:00' + ((i + 1) * 15 || ' minutes')::INTERVAL);
        
        inicio_3 := (TIME '09:00:00' + (i * 15 || ' minutes')::INTERVAL);
        fin_3    := (TIME '09:00:00' + ((i + 1) * 15 || ' minutes')::INTERVAL);
        
        inicio_4 := (TIME '11:00:00' + (i * 15 || ' minutes')::INTERVAL);
        fin_4    := (TIME '11:00:00' + ((i + 1) * 15 || ' minutes')::INTERVAL);

        INSERT INTO horario_fs (dia_semana, hora_inicio, hora_fin, funcionario_rut) VALUES
        ('MONDAY', inicio_1, fin_1, '12345678-9'),
        ('TUESDAY', inicio_2, fin_2, '98765432-1'),
        ('WEDNESDAY', inicio_3, fin_3, '22121545-1'),
        ('FRIDAY', inicio_4, fin_4, '21955190-3');
    END LOOP;

    -- 3.2 Generación Física del Inventario de Vacunas (10 unidades por tipo)
    FOR i IN 1..10 LOOP
        INSERT INTO vacuna (tipo_vacuna_id, stock_vacuna_id) VALUES 
        (1, 1),  -- Pfizer asociada a Stock 1
        (2, 2),  -- AstraZeneca asociada a Stock 2
        (3, 3);  -- Influvac asociada a Stock 3
    END LOOP;
END $$;