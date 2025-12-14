-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 14-Dez-2025 às 23:59
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `qualidade_de_software`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `awardassigment`
--

CREATE TABLE `awardassigment` (
  `AA_ID` bigint(20) NOT NULL,
  `AA_A_ID` bigint(20) DEFAULT NULL,
  `AA_T_ID` bigint(20) DEFAULT NULL,
  `AA_S_ID` bigint(20) DEFAULT NULL,
  `AA_TE_ID` bigint(20) DEFAULT NULL,
  `AA_Date` datetime DEFAULT NULL,
  `AA_Reason` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `awards`
--

CREATE TABLE `awards` (
  `A_ID` bigint(20) NOT NULL,
  `A_Name` varchar(60) DEFAULT NULL,
  `A_Description` varchar(200) DEFAULT NULL,
  `A_Points` bigint(20) DEFAULT NULL,
  `A_Type` varchar(20) DEFAULT NULL,
  `A_Trigger_Condition` varchar(100) DEFAULT NULL,
  `A_T_ID` bigint(20) DEFAULT NULL,
  `A_Target` varchar(20) DEFAULT 'estudante'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `course`
--

CREATE TABLE `course` (
  `C_ID` bigint(20) NOT NULL,
  `C_T_ID` bigint(20) NOT NULL,
  `C_Name` varchar(100) NOT NULL,
  `C_Description` varchar(255) DEFAULT NULL,
  `C_Created_At` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `discipline`
--

CREATE TABLE `discipline` (
  `D_ID` bigint(20) NOT NULL,
  `D_T_ID` bigint(20) DEFAULT NULL,
  `D_Name` varchar(100) DEFAULT NULL,
  `D_Description` varchar(200) DEFAULT NULL,
  `D_Created_At` datetime DEFAULT current_timestamp(),
  `D_C_ID` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `evaluation`
--

CREATE TABLE `evaluation` (
  `E_ID` bigint(20) NOT NULL,
  `E_SP_ID` bigint(20) DEFAULT NULL,
  `E_TE_ID` bigint(20) DEFAULT NULL,
  `E_Metric` varchar(100) DEFAULT NULL,
  `E_Value` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `project`
--

CREATE TABLE `project` (
  `P_ID` bigint(20) NOT NULL,
  `P_Name` varchar(150) DEFAULT NULL,
  `P_Description` varchar(500) DEFAULT NULL,
  `P_Start_Date` datetime DEFAULT NULL,
  `P_End_Date` datetime DEFAULT NULL,
  `P_Status` varchar(20) DEFAULT 'ativo',
  `P_D_ID` bigint(20) DEFAULT NULL,
  `P_Mode` enum('Individual','Equipa') NOT NULL DEFAULT 'Equipa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `sprint`
--

CREATE TABLE `sprint` (
  `SP_ID` bigint(20) NOT NULL,
  `SP_P_ID` bigint(20) DEFAULT NULL,
  `SP_Name` varchar(150) DEFAULT NULL,
  `SP_Start_Date` datetime DEFAULT NULL,
  `SP_End_Date` datetime DEFAULT NULL,
  `SP_Objectives` varchar(200) DEFAULT NULL,
  `SP_Status` varchar(20) DEFAULT 'em-espera'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `student`
--

CREATE TABLE `student` (
  `S_ID` bigint(20) NOT NULL,
  `S_Year` varchar(4) DEFAULT NULL,
  `S_Class` varchar(40) DEFAULT NULL,
  `S_U_ID` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `studentcourse`
--

CREATE TABLE `studentcourse` (
  `SC_S_ID` bigint(20) NOT NULL,
  `SC_D_ID` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `task`
--

CREATE TABLE `task` (
  `T_ID` bigint(20) NOT NULL,
  `T_TE_ID` bigint(20) NOT NULL,
  `T_Name` varchar(100) NOT NULL,
  `T_Description` varchar(300) DEFAULT NULL,
  `T_Completed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teacher`
--

CREATE TABLE `teacher` (
  `T_ID` bigint(20) NOT NULL,
  `T_Institution` varchar(20) DEFAULT NULL,
  `T_Department` varchar(60) DEFAULT NULL,
  `T_U_ID` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `team`
--

CREATE TABLE `team` (
  `TE_ID` bigint(20) NOT NULL,
  `TE_P_ID` bigint(20) DEFAULT NULL,
  `TE_Name` varchar(16) DEFAULT NULL,
  `TE_Capacity` int(11) DEFAULT 4,
  `TE_Type` varchar(20) DEFAULT 'Aberta',
  `TE_Created_By_S_ID` bigint(20) DEFAULT NULL,
  `TE_Points` bigint(20) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `team_member`
--

CREATE TABLE `team_member` (
  `TM_TE_ID` bigint(20) NOT NULL,
  `TM_S_ID` bigint(20) NOT NULL,
  `TM_Role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `U_ID` bigint(20) NOT NULL,
  `U_Email` varchar(254) DEFAULT NULL,
  `U_Password` varchar(20) DEFAULT NULL,
  `U_Name` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `awardassigment`
--
ALTER TABLE `awardassigment`
  ADD PRIMARY KEY (`AA_ID`),
  ADD KEY `FK_AwardAssigment_Awards` (`AA_A_ID`),
  ADD KEY `FK_AwardAssigment_Teacher` (`AA_T_ID`),
  ADD KEY `FK_AwardAssigment_Student` (`AA_S_ID`),
  ADD KEY `FK_AwardAssigment_Team` (`AA_TE_ID`);

--
-- Índices para tabela `awards`
--
ALTER TABLE `awards`
  ADD PRIMARY KEY (`A_ID`),
  ADD KEY `FK_Awards_Teacher` (`A_T_ID`);

--
-- Índices para tabela `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`C_ID`),
  ADD KEY `C_T_ID` (`C_T_ID`);

--
-- Índices para tabela `discipline`
--
ALTER TABLE `discipline`
  ADD PRIMARY KEY (`D_ID`),
  ADD KEY `FK_Discipline_Teacher` (`D_T_ID`),
  ADD KEY `D_C_ID` (`D_C_ID`);

--
-- Índices para tabela `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`E_ID`),
  ADD KEY `FK_Evaluation_Sprint` (`E_SP_ID`),
  ADD KEY `FK_Evaluation_Team` (`E_TE_ID`);

--
-- Índices para tabela `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`P_ID`),
  ADD KEY `FK_Project_Discipline` (`P_D_ID`);

--
-- Índices para tabela `sprint`
--
ALTER TABLE `sprint`
  ADD PRIMARY KEY (`SP_ID`),
  ADD KEY `FK_Sprint_Project` (`SP_P_ID`);

--
-- Índices para tabela `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`S_ID`),
  ADD KEY `FK_Student_User` (`S_U_ID`);

--
-- Índices para tabela `studentcourse`
--
ALTER TABLE `studentcourse`
  ADD PRIMARY KEY (`SC_S_ID`,`SC_D_ID`),
  ADD KEY `FK_StudentCourse_Discipline` (`SC_D_ID`);

--
-- Índices para tabela `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`T_ID`),
  ADD KEY `FK_Task_Team` (`T_TE_ID`);

--
-- Índices para tabela `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`T_ID`),
  ADD KEY `FK_Teacher_User` (`T_U_ID`);

--
-- Índices para tabela `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`TE_ID`),
  ADD KEY `FK_Team_Project` (`TE_P_ID`),
  ADD KEY `FK_Team_CreatedBy_Student` (`TE_Created_By_S_ID`);

--
-- Índices para tabela `team_member`
--
ALTER TABLE `team_member`
  ADD PRIMARY KEY (`TM_TE_ID`,`TM_S_ID`),
  ADD UNIQUE KEY `UQ_Student_Only_One_Team_Per_Project` (`TM_S_ID`,`TM_TE_ID`),
  ADD KEY `FK_Team_Member_Student` (`TM_S_ID`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`U_ID`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `awardassigment`
--
ALTER TABLE `awardassigment`
  MODIFY `AA_ID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `awards`
--
ALTER TABLE `awards`
  MODIFY `A_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `course`
--
ALTER TABLE `course`
  MODIFY `C_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `discipline`
--
ALTER TABLE `discipline`
  MODIFY `D_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `E_ID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `project`
--
ALTER TABLE `project`
  MODIFY `P_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `sprint`
--
ALTER TABLE `sprint`
  MODIFY `SP_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `student`
--
ALTER TABLE `student`
  MODIFY `S_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `task`
--
ALTER TABLE `task`
  MODIFY `T_ID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `teacher`
--
ALTER TABLE `teacher`
  MODIFY `T_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `team`
--
ALTER TABLE `team`
  MODIFY `TE_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `U_ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `awardassigment`
--
ALTER TABLE `awardassigment`
  ADD CONSTRAINT `FK_AwardAssigment_Awards` FOREIGN KEY (`AA_A_ID`) REFERENCES `awards` (`A_ID`),
  ADD CONSTRAINT `FK_AwardAssigment_Student` FOREIGN KEY (`AA_S_ID`) REFERENCES `student` (`S_ID`),
  ADD CONSTRAINT `FK_AwardAssigment_Teacher` FOREIGN KEY (`AA_T_ID`) REFERENCES `teacher` (`T_ID`),
  ADD CONSTRAINT `FK_AwardAssigment_Team` FOREIGN KEY (`AA_TE_ID`) REFERENCES `team` (`TE_ID`);

--
-- Limitadores para a tabela `awards`
--
ALTER TABLE `awards`
  ADD CONSTRAINT `FK_Awards_Teacher` FOREIGN KEY (`A_T_ID`) REFERENCES `teacher` (`T_ID`);

--
-- Limitadores para a tabela `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`C_T_ID`) REFERENCES `teacher` (`T_ID`);

--
-- Limitadores para a tabela `discipline`
--
ALTER TABLE `discipline`
  ADD CONSTRAINT `FK_Discipline_Teacher` FOREIGN KEY (`D_T_ID`) REFERENCES `teacher` (`T_ID`),
  ADD CONSTRAINT `discipline_ibfk_1` FOREIGN KEY (`D_C_ID`) REFERENCES `course` (`C_ID`);

--
-- Limitadores para a tabela `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `FK_Evaluation_Sprint` FOREIGN KEY (`E_SP_ID`) REFERENCES `sprint` (`SP_ID`),
  ADD CONSTRAINT `FK_Evaluation_Team` FOREIGN KEY (`E_TE_ID`) REFERENCES `team` (`TE_ID`);

--
-- Limitadores para a tabela `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `FK_Project_Discipline` FOREIGN KEY (`P_D_ID`) REFERENCES `discipline` (`D_ID`);

--
-- Limitadores para a tabela `sprint`
--
ALTER TABLE `sprint`
  ADD CONSTRAINT `FK_Sprint_Project` FOREIGN KEY (`SP_P_ID`) REFERENCES `project` (`P_ID`);

--
-- Limitadores para a tabela `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `FK_Student_User` FOREIGN KEY (`S_U_ID`) REFERENCES `user` (`U_ID`);

--
-- Limitadores para a tabela `studentcourse`
--
ALTER TABLE `studentcourse`
  ADD CONSTRAINT `FK_StudentCourse_Discipline` FOREIGN KEY (`SC_D_ID`) REFERENCES `discipline` (`D_ID`),
  ADD CONSTRAINT `FK_StudentCourse_Student` FOREIGN KEY (`SC_S_ID`) REFERENCES `student` (`S_ID`);

--
-- Limitadores para a tabela `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `FK_Task_Team` FOREIGN KEY (`T_TE_ID`) REFERENCES `team` (`TE_ID`);

--
-- Limitadores para a tabela `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `FK_Teacher_User` FOREIGN KEY (`T_U_ID`) REFERENCES `user` (`U_ID`);

--
-- Limitadores para a tabela `team`
--
ALTER TABLE `team`
  ADD CONSTRAINT `FK_Team_CreatedBy_Student` FOREIGN KEY (`TE_Created_By_S_ID`) REFERENCES `student` (`S_ID`),
  ADD CONSTRAINT `FK_Team_Project` FOREIGN KEY (`TE_P_ID`) REFERENCES `project` (`P_ID`);

--
-- Limitadores para a tabela `team_member`
--
ALTER TABLE `team_member`
  ADD CONSTRAINT `FK_Team_Member_Student` FOREIGN KEY (`TM_S_ID`) REFERENCES `student` (`S_ID`),
  ADD CONSTRAINT `FK_Team_Member_Team` FOREIGN KEY (`TM_TE_ID`) REFERENCES `team` (`TE_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
