SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema labjack_t7pro_database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema labjack_t7pro_database
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `labjack_t7pro_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `labjack_t7pro_database` ;

-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`device`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`device` (
  `device_id` INT NOT NULL AUTO_INCREMENT,
  `device_name` VARCHAR(255) NULL DEFAULT NULL,
  `comments` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`device_channels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`device_channels` (
  `channel_id` INT NOT NULL AUTO_INCREMENT,
  `channel_name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`channel_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`experiment_channels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`experiment_channels` (
  `experiment_channel_id` INT NOT NULL AUTO_INCREMENT,
  `log_id` INT NULL DEFAULT NULL,
  `channel_id` INT NULL DEFAULT NULL,
  `param_type_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`experiment_channel_id`),
  INDEX `log_id` (`log_id` ASC) VISIBLE,
  INDEX `param_type_id` (`param_type_id` ASC) VISIBLE,
  INDEX `channel_id` (`channel_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`experiment_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`experiment_logs` (
  `start_time` TIMESTAMP NULL DEFAULT NULL,
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `comments` TEXT NULL DEFAULT NULL,
  `device_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  INDEX `device_id` (`device_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`experiment_parameters`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`experiment_parameters` (
  `experiment_param_id` INT NOT NULL AUTO_INCREMENT,
  `param_type_id` INT NULL DEFAULT NULL,
  `log_id` INT NULL DEFAULT NULL,
  `param_value` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`experiment_param_id`),
  INDEX `param_type_id` (`param_type_id` ASC) VISIBLE,
  INDEX `log_id` (`log_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`labjack_t7_pro_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`labjack_t7_pro_data` (
  `experiment_time` TIMESTAMP NULL DEFAULT NULL,
  `labjack_data_id` INT NOT NULL AUTO_INCREMENT,
  `log_id` INT NULL DEFAULT NULL,
  `channel1_id` FLOAT NULL DEFAULT NULL,
  `channel1_data` FLOAT NULL DEFAULT NULL,
  `channel2_id` FLOAT NULL DEFAULT NULL,
  `channel2_data` FLOAT NULL DEFAULT NULL,
  `channel3_id` FLOAT NULL DEFAULT NULL,
  `channel3_data` FLOAT NULL DEFAULT NULL,
  `channel4_id` FLOAT NULL DEFAULT NULL,
  `channel4_data` FLOAT NULL DEFAULT NULL,
  `channel5_id` FLOAT NULL DEFAULT NULL,
  `channel5_data` FLOAT NULL DEFAULT NULL,
  `channel6_id` FLOAT NULL DEFAULT NULL,
  `channel6_data` FLOAT NULL DEFAULT NULL,
  `channel7_id` FLOAT NULL DEFAULT NULL,
  `channel7_data` FLOAT NULL DEFAULT NULL,
  `channel8_id` FLOAT NULL DEFAULT NULL,
  `channel8_data` FLOAT NULL DEFAULT NULL,
  `channel9_id` FLOAT NULL DEFAULT NULL,
  `channel9_data` FLOAT NULL DEFAULT NULL,
  `channel10_id` FLOAT NULL DEFAULT NULL,
  `channel10_data` FLOAT NULL DEFAULT NULL,
  `channel11_id` FLOAT NULL DEFAULT NULL,
  `channel11_data` FLOAT NULL DEFAULT NULL,
  `channel12_id` FLOAT NULL DEFAULT NULL,
  `channel12_data` FLOAT NULL DEFAULT NULL,
  `channel13_id` FLOAT NULL DEFAULT NULL,
  `channel13_data` FLOAT NULL DEFAULT NULL,
  `channel14_id` FLOAT NULL DEFAULT NULL,
  `channel14_data` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`labjack_data_id`),
  INDEX `log_id` (`log_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`parameter_channel_relationships`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`parameter_channel_relationships` (
  `relationship_id` INT NOT NULL AUTO_INCREMENT,
  `channel_id` INT NULL DEFAULT NULL,
  `param_type_id` INT NULL DEFAULT NULL,
  `device_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`relationship_id`),
  INDEX `channel_id` (`channel_id` ASC) VISIBLE,
  INDEX `param_type_id` (`param_type_id` ASC) VISIBLE,
  INDEX `device_id` (`device_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`parameter_classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`parameter_classes` (
  `param_class_id` INT NOT NULL AUTO_INCREMENT,
  `param_class` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`param_class_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `labjack_t7pro_database`.`parameter_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `labjack_t7pro_database`.`parameter_types` (
  `param_type_id` INT NOT NULL AUTO_INCREMENT,
  `param_type` VARCHAR(255) NULL DEFAULT NULL,
  `param_class_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`param_type_id`),
  UNIQUE INDEX `param_type` (`param_type` ASC) VISIBLE,
  INDEX `param_class_id` (`param_class_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
