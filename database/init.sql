-- =============================================================================
-- 1. ESTRUCTURA DE TABLAS (DDL)
-- =============================================================================

CREATE TABLE IF NOT EXISTS centro_vacunacion (
    "idCentro" SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    direccion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS campania (
    "idCampania" SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    descripcion TEXT,
    estado_campania VARCHAR(50),
    edad_minima INT,
    edad_maxima INT
);

CREATE TABLE IF NOT EXISTS horario_centro (
    id_horario_centro SERIAL PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    centro_id INT REFERENCES centro_vacunacion("idCentro") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tipo_vacuna (
    id_tipo_vacuna SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    dosis_requeridas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS stock_vacuna (
    "idStockVacuna" SERIAL PRIMARY KEY,
    cantidad_reservada INT DEFAULT 0,
    campania_id INT REFERENCES campania("idCampania") ON DELETE CASCADE,
    centro_id INT REFERENCES centro_vacunacion("idCentro") ON DELETE CASCADE,
    tipo_vacuna_id INT REFERENCES tipo_vacuna(id_tipo_vacuna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vacuna (
    id_vacuna SERIAL PRIMARY KEY,
    tipo_vacuna_id INT REFERENCES tipo_vacuna(id_tipo_vacuna) ON DELETE CASCADE,
    stock_vacuna_id INT REFERENCES stock_vacuna("idStockVacuna") ON DELETE CASCADE,
    estado_vacuna VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS func_salud (
    rut VARCHAR(12) PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fono VARCHAR(20),
    correo_electronico VARCHAR(255),
    fecha_nacimiento DATE,
    preferencia VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    centro_id INT REFERENCES centro_vacunacion("idCentro") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS horario_fs (
    id_horario_fs SERIAL PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    func_salud_rut VARCHAR(12) REFERENCES func_salud(rut) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS horario_bloqueo (
    id_horario_bloqueo SERIAL PRIMARY KEY,
    horario_fs_id INT NOT NULL REFERENCES horario_fs(id_horario_fs) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    UNIQUE (horario_fs_id, fecha)
);
CREATE TABLE IF NOT EXISTS paciente (
    rut VARCHAR(12) PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fono VARCHAR(20),
    correo_electronico VARCHAR(255),
    fecha_nacimiento DATE,
    preferencia VARCHAR(50),
    password VARCHAR(255) NOT NULL
);


-- =============================================================================
-- 2. INSERCIÓN DE DATOS (DML)
-- =============================================================================

-- 2.1 Campañas
INSERT INTO campania ("idCampania", nombre, fecha_inicio, fecha_fin, descripcion, estado_campania, edad_minima, edad_maxima) VALUES
(1, 'Campaña covid 2026', '2026-01-01', '2026-12-30', 'Campaña anual de covid', 'EN_CURSO', 18, 60),
(2, 'Campaña influenza 2026', '2026-01-01', '2026-12-30', 'Campaña anual de influenza', 'EN_CURSO', 18, 60);

-- Ajuste de secuencia (las mayúsculas requieren comillas dobles en PostgreSQL)
ALTER SEQUENCE "campania_idCampania_seq" RESTART WITH 3;

-- 2.2 Centros de Vacunación
INSERT INTO centro_vacunacion ("idCentro", nombre, tipo, direccion) VALUES
(1, 'CESFAM O''Higgins', 'CESFAM', 'Salas 538, Concepción'),
(2, 'CESFAM Víctor Manuel Fernández', 'CESFAM', 'Maipú 2120, Concepción');

ALTER SEQUENCE "centro_vacunacion_idCentro_seq" RESTART WITH 3;

-- 2.3 Horarios de Centros
INSERT INTO horario_centro (dia_semana, hora_apertura, hora_cierre, centro_id) VALUES
('MONDAY', '08:00:00', '18:00:00', 1),
('TUESDAY', '08:00:00', '18:00:00', 1),
('WEDNESDAY', '09:00:00', '18:00:00', 2),
('FRIDAY', '09:00:00', '15:00:00', 2);

-- 2.4 Tipos de Vacuna
INSERT INTO tipo_vacuna (id_tipo_vacuna, nombre, dosis_requeridas) VALUES
(1, 'pzifer', 2),
(2, 'astrazeneca', 1),
(3, 'influvac', 1);

ALTER SEQUENCE tipo_vacuna_id_tipo_vacuna_seq RESTART WITH 4;

-- 2.5 Perfiles de Stock de Vacunas
INSERT INTO stock_vacuna ("idStockVacuna", cantidad_reservada, campania_id, centro_id, tipo_vacuna_id) VALUES
(1, 0, 1, 1, 1), -- Stock 1: Covid, CESFAM O'Higgins, Pfizer
(2, 0, 1, 1, 2), -- Stock 2: Covid, CESFAM O'Higgins, Astrazeneca
(3, 0, 1, 2, 2), -- Stock 3: Covid, CESFAM VMF, Astrazeneca
(4, 0, 2, 2, 3); -- Stock 4: Influenza, CESFAM VMF, Influvac

ALTER SEQUENCE "stock_vacuna_idStockVacuna_seq" RESTART WITH 4;

-- 2.6 Funcionarios de Salud
INSERT INTO func_salud (rut, nombres, apellidos, fono, correo_electronico, fecha_nacimiento, preferencia, password, centro_id) VALUES
('12345678-9', 'Carlos', 'Pérez', '912345678', 'serranosimon21@gmail.com', '1985-03-15', 'CORREOELECTRONICO', '$2a$10$5cbxPeTa2/8dUjYj0SeJ6eSwT/yJOnT5B4EvBrBo3.hNH5XHZGQwu', 1),
('98765432-1', 'Ana', 'González', '923738870', 'serranosimon21@gmail.com', '1990-07-20', 'SMS', '$2a$10$5cbxPeTa2/8dUjYj0SeJ6eSwT/yJOnT5B4EvBrBo3.hNH5XHZGQwu', 1),
('22121545-1', 'Alfredo', 'Castro', '923738870', 'serranosimon21@gmail.com', '1990-07-20', 'SMS', '$2a$10$5cbxPeTa2/8dUjYj0SeJ6eSwT/yJOnT5B4EvBrBo3.hNH5XHZGQwu', 2),
('21955190-3', 'Thomas', 'Sankara', '923738870', 'serranosimon21@gmail.com', '1990-07-20', 'SMS', '$2a$10$5cbxPeTa2/8dUjYj0SeJ6eSwT/yJOnT5B4EvBrBo3.hNH5XHZGQwu', 2);

-- 2.7 Pacientes
INSERT INTO paciente (rut, nombres, apellidos, fono, correo_electronico, fecha_nacimiento, preferencia, password) VALUES
('7382025-1', 'María', 'López', '923738870', 'serranosimon21@gmail.com', '1995-05-10', 'AMBOS', '$2a$10$zGRad//otaAgh4N1wm2Sa.a1s0ncaeTsUF2/LJy8EXphPIM.dqeXa'),
('14034959-3', 'Juan', 'Martínez', '923738870', 'serranosimon21@gmail.com', '1988-11-25', 'SMS', '$2a$10$zGRad//otaAgh4N1wm2Sa.a1s0ncaeTsUF2/LJy8EXphPIM.dqeXa');


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

        
        INSERT INTO horario_fs (dia_semana, hora_inicio, hora_fin, func_salud_rut) VALUES
        ('MONDAY', inicio_1, fin_1, '12345678-9'),
        ('TUESDAY', inicio_2, fin_2, '98765432-1'),
        ('WEDNESDAY', inicio_3, fin_3, '22121545-1'),
        ('FRIDAY', inicio_4, fin_4, '21955190-3');
    END LOOP;

    -- 3.2 Generación Física del Inventario de Vacunas (10 unidades por tipo)
    FOR i IN 1..2 LOOP
        -- Fíjate que aquí usamos stock_vacuna_id
        INSERT INTO vacuna (tipo_vacuna_id, stock_vacuna_id, estado_vacuna) VALUES 
        (1, 1, 'DISPONIBLE'),
        (2, 2, 'DISPONIBLE'),  
        (2, 3, 'DISPONIBLE'),  
        (3, 4, 'DISPONIBLE');  
    END LOOP;
END $$; 