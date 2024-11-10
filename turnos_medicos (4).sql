-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-11-2024 a las 18:46:57
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
-- Base de datos: `turnos_medicos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda`
--

CREATE TABLE `agenda` (
  `agendaid` int(20) NOT NULL,
  `persona_id` int(20) NOT NULL,
  `sucursal_id` int(20) NOT NULL,
  `ttipoid` int(20) NOT NULL,
  `nombreagenda` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `duracion` int(100) NOT NULL,
  `medico_id` int(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendar`
--

CREATE TABLE `calendar` (
  `calendarid` int(11) NOT NULL,
  `agendaid` int(20) NOT NULL,
  `fechaturno` date NOT NULL,
  `inicioturno` time NOT NULL,
  `finalturno` time NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE `especialidad` (
  `especialidadId` int(11) NOT NULL,
  `nombre_esp` varchar(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `estadoid` int(11) NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `medicoid` int(11) NOT NULL,
  `personaid` int(11) NOT NULL,
  `especialidadId` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_esp`
--

CREATE TABLE `medico_esp` (
  `matricula` varchar(100) NOT NULL,
  `medicoid` int(20) NOT NULL,
  `especialidadid` int(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `perfilid` int(20) NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `permisos` varchar(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`perfilid`, `tipo`, `permisos`) VALUES
(1, 'admin', 'all'),
(2, 'medico', ''),
(3, 'secretaria', ''),
(4, 'paciente', 'turnos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `personaid` int(20) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `dni` int(20) NOT NULL,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `localidad` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `mail` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `foto_dni` varchar(255) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`personaid`, `userid`, `dni`, `nombre`, `apellido`, `direccion`, `localidad`, `telefono`, `mail`, `foto_dni`, `foto_perfil`, `createdAt`, `updateAt`) VALUES
(14, NULL, 5587412, 'mauro', 'benito', 'asd 585', 'juana koslay', '34252454', 'aa@gmail.com', NULL, NULL, '2024-11-07 15:04:53', '2024-11-07 15:04:53'),
(16, 11, 784562, 'jose', 'cito', 'Colon 445 San luis', 'san luis', '232424', 'prueba@gmail.com', '/uploads/dni/1730989190795.png', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `sucursalid` int(20) NOT NULL,
  `nombre_sucrsal` varchar(100) NOT NULL,
  `direccion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoatencion`
--

CREATE TABLE `tipoatencion` (
  `atencionid` int(11) NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `observaciones` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipoatencion`
--

INSERT INTO `tipoatencion` (`atencionid`, `tipo`, `descripcion`, `observaciones`) VALUES
(2, 'primer consulta', 'paciente nuevo', ''),
(3, 'control', 'control medico', ''),
(4, 'estudios', 'tomografia, radiografia, resonancia', ''),
(5, 'internacion', 'paciente ingresa como huesped', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno`
--

CREATE TABLE `turno` (
  `turniid` int(20) NOT NULL,
  `persona_id` int(20) NOT NULL,
  `calendar_id` int(20) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estadoturno_id` int(4) NOT NULL,
  `observaciones` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `userid` int(11) NOT NULL,
  `idperfil` int(11) NOT NULL DEFAULT 4,
  `nombre_user` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`userid`, `idperfil`, `nombre_user`, `password`, `estado`, `createdAt`, `updateAt`) VALUES
(9, 1, 'mauro', '123456', 1, '2024-11-07 15:05:32', '2024-11-07 15:05:32'),
(10, 1, 'mauro', '123456', 1, '2024-11-07 15:05:32', '2024-11-07 15:05:32'),
(11, 4, 'prueba@gmail.com', '123456', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`agendaid`),
  ADD KEY `persona_id` (`persona_id`),
  ADD KEY `medico_id` (`medico_id`),
  ADD KEY `sucursal_id` (`sucursal_id`),
  ADD KEY `ttipoid` (`ttipoid`);

--
-- Indices de la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`calendarid`),
  ADD KEY `agendaid` (`agendaid`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  ADD PRIMARY KEY (`especialidadId`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`estadoid`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`medicoid`),
  ADD KEY `personaid` (`personaid`),
  ADD KEY `especialidadId` (`especialidadId`);

--
-- Indices de la tabla `medico_esp`
--
ALTER TABLE `medico_esp`
  ADD PRIMARY KEY (`medicoid`),
  ADD KEY `especialidadid` (`especialidadid`),
  ADD KEY `medicoid` (`medicoid`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`perfilid`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`personaid`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD KEY `persona_ibfk_1` (`userid`),
  ADD KEY `dni` (`dni`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`sucursalid`);

--
-- Indices de la tabla `tipoatencion`
--
ALTER TABLE `tipoatencion`
  ADD PRIMARY KEY (`atencionid`);

--
-- Indices de la tabla `turno`
--
ALTER TABLE `turno`
  ADD PRIMARY KEY (`turniid`),
  ADD KEY `calendar-id` (`calendar_id`),
  ADD KEY `estadoturno_id` (`estadoturno_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`),
  ADD KEY `nombre_user` (`nombre_user`),
  ADD KEY `idperfil` (`idperfil`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agenda`
--
ALTER TABLE `agenda`
  MODIFY `agendaid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calendar`
--
ALTER TABLE `calendar`
  MODIFY `calendarid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `especialidadId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `estadoid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `medicoid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `perfil`
--
ALTER TABLE `perfil`
  MODIFY `perfilid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `personaid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `sucursalid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipoatencion`
--
ALTER TABLE `tipoatencion`
  MODIFY `atencionid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `turniid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`personaid`),
  ADD CONSTRAINT `agenda_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`medicoid`),
  ADD CONSTRAINT `agenda_ibfk_3` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursalid`),
  ADD CONSTRAINT `agenda_ibfk_4` FOREIGN KEY (`ttipoid`) REFERENCES `tipoatencion` (`atencionid`);

--
-- Filtros para la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`agendaid`) REFERENCES `agenda` (`agendaid`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`personaid`) REFERENCES `persona` (`personaid`),
  ADD CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`especialidadId`) REFERENCES `especialidad` (`especialidadId`);

--
-- Filtros para la tabla `medico_esp`
--
ALTER TABLE `medico_esp`
  ADD CONSTRAINT `medico_esp_ibfk_1` FOREIGN KEY (`medicoid`) REFERENCES `medicos` (`medicoid`),
  ADD CONSTRAINT `medico_esp_ibfk_2` FOREIGN KEY (`especialidadid`) REFERENCES `especialidad` (`especialidadId`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`);

--
-- Filtros para la tabla `turno`
--
ALTER TABLE `turno`
  ADD CONSTRAINT `turno_ibfk_1` FOREIGN KEY (`calendar_id`) REFERENCES `calendar` (`calendarid`),
  ADD CONSTRAINT `turno_ibfk_2` FOREIGN KEY (`estadoturno_id`) REFERENCES `estado` (`estadoid`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`idperfil`) REFERENCES `perfil` (`perfilid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
