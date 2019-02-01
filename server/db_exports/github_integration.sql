/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.1.37-MariaDB : Database - github_integration
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`github_integration` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `github_integration`;

/*Table structure for table `starred_repos` */

DROP TABLE IF EXISTS `starred_repos`;

CREATE TABLE `starred_repos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `description` text,
  `html_url` varchar(500) DEFAULT NULL,
  `stargazers_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

/*Data for the table `starred_repos` */

insert  into `starred_repos`(`id`,`username`,`full_name`,`description`,`html_url`,`stargazers_count`) values (1,'amelacokaj','hapijs/hapi','Server Framework  for Node.js','https://github.com/hapijs/hapi',10713),(2,'amelacokaj','vuejs/vue','???? Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.','https://github.com/vuejs/vue',126730);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
