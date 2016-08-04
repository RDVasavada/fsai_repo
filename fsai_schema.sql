-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: fsai
-- ------------------------------------------------------
-- Server version	5.5.49-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissi_permission_id_84c5c92e_fk_auth_permission_id` (`permission_id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_group_permissi_permission_id_84c5c92e_fk_auth_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permissi_content_type_id_2f476e4b_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add permission',1,'add_permission'),(2,'Can change permission',1,'change_permission'),(3,'Can delete permission',1,'delete_permission'),(4,'Can add group',2,'add_group'),(5,'Can change group',2,'change_group'),(6,'Can delete group',2,'delete_group'),(7,'Can add content type',3,'add_contenttype'),(8,'Can change content type',3,'change_contenttype'),(9,'Can delete content type',3,'delete_contenttype'),(10,'Can add session',4,'add_session'),(11,'Can change session',4,'change_session'),(12,'Can delete session',4,'delete_session'),(13,'Can add site',5,'add_site'),(14,'Can change site',5,'change_site'),(15,'Can delete site',5,'delete_site'),(16,'Can add log entry',6,'add_logentry'),(17,'Can change log entry',6,'change_logentry'),(18,'Can delete log entry',6,'delete_logentry'),(19,'Can add portal user',7,'add_portaluser'),(20,'Can change portal user',7,'change_portaluser'),(21,'Can delete portal user',7,'delete_portaluser'),(22,'Can add portfolio',8,'add_portfolio'),(23,'Can change portfolio',8,'change_portfolio'),(24,'Can delete portfolio',8,'delete_portfolio'),(25,'Can add stock',9,'add_stock'),(26,'Can change stock',9,'change_stock'),(27,'Can delete stock',9,'delete_stock');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin__content_type_id_c4bce8eb_fk_django_content_type_id` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_portal_portaluser_id` (`user_id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_portal_portaluser_id` FOREIGN KEY (`user_id`) REFERENCES `portal_portaluser` (`id`),
  CONSTRAINT `django_admin__content_type_id_c4bce8eb_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (6,'admin','logentry'),(2,'auth','group'),(1,'auth','permission'),(3,'contenttypes','contenttype'),(7,'portal','portaluser'),(8,'portal','portfolio'),(9,'portal','stock'),(4,'sessions','session'),(5,'sites','site');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2016-07-01 03:55:39'),(2,'contenttypes','0002_remove_content_type_name','2016-07-01 03:55:40'),(3,'auth','0001_initial','2016-07-01 03:55:41'),(4,'auth','0002_alter_permission_name_max_length','2016-07-01 03:55:42'),(5,'auth','0003_alter_user_email_max_length','2016-07-01 03:55:42'),(6,'auth','0004_alter_user_username_opts','2016-07-01 03:55:42'),(7,'auth','0005_alter_user_last_login_null','2016-07-01 03:55:42'),(8,'auth','0006_require_contenttypes_0002','2016-07-01 03:55:42'),(9,'portal','0001_initial','2016-07-01 03:55:44'),(10,'admin','0001_initial','2016-07-01 03:55:45'),(11,'admin','0002_logentry_remove_auto_add','2016-07-01 03:55:45'),(12,'auth','0007_alter_validators_add_error_messages','2016-07-01 03:55:45'),(13,'portal','0002_portfolio_stock','2016-07-01 03:55:46'),(14,'portal','0003_auto_20151103_2011','2016-07-01 03:55:47'),(15,'portal','0004_remove_portaluser_password_repeat','2016-07-01 03:55:48'),(16,'portal','0005_portaluser_resettoken','2016-07-01 03:55:48'),(17,'portal','0006_portaluser_tokencreatedate','2016-07-01 03:55:48'),(18,'portal','0007_auto_20160701_0355','2016-07-01 03:55:49'),(19,'sessions','0001_initial','2016-07-01 03:55:49'),(20,'sites','0001_initial','2016-07-01 03:55:50'),(21,'sites','0002_alter_domain_unique','2016-07-01 03:55:50'),(22,'portal','0008_auto_20160804_1159','2016-08-04 11:59:18');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_de54fa62` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('e4lyff2dlxoarewadedsd10lrrbrneaj','NmUyMGQ5YTNjODcwMzcxZTNjNmQwZjFlMjRiNDIyYTEwOTRmZGUyOTp7Il9hdXRoX3VzZXJfaGFzaCI6ImI1YmEzMDhhMDZhYzExZWVmMGViMjZhZDMxMTlhNWNmYjcxMmE1ZTgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOiIxIn0=','2016-07-15 04:22:59'),('ijxpy716f3tonbhlghlvpmxta0f31w76','NmUyMGQ5YTNjODcwMzcxZTNjNmQwZjFlMjRiNDIyYTEwOTRmZGUyOTp7Il9hdXRoX3VzZXJfaGFzaCI6ImI1YmEzMDhhMDZhYzExZWVmMGViMjZhZDMxMTlhNWNmYjcxMmE1ZTgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOiIxIn0=','2016-07-20 10:27:32'),('nvbj5f9rm8yhzso2fp0wqt3ih19rh9w9','NmUyMGQ5YTNjODcwMzcxZTNjNmQwZjFlMjRiNDIyYTEwOTRmZGUyOTp7Il9hdXRoX3VzZXJfaGFzaCI6ImI1YmEzMDhhMDZhYzExZWVmMGViMjZhZDMxMTlhNWNmYjcxMmE1ZTgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOiIxIn0=','2016-08-12 10:34:24'),('qeor4yx2vik354jsj93hoa63lj9tjs0x','NmUyMGQ5YTNjODcwMzcxZTNjNmQwZjFlMjRiNDIyYTEwOTRmZGUyOTp7Il9hdXRoX3VzZXJfaGFzaCI6ImI1YmEzMDhhMDZhYzExZWVmMGViMjZhZDMxMTlhNWNmYjcxMmE1ZTgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOiIxIn0=','2016-07-31 11:24:08');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_site`
--

DROP TABLE IF EXISTS `django_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_site_domain_a2e37b91_uniq` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_site`
--

LOCK TABLES `django_site` WRITE;
/*!40000 ALTER TABLE `django_site` DISABLE KEYS */;
INSERT INTO `django_site` VALUES (1,'example.com','example.com');
/*!40000 ALTER TABLE `django_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_portaluser`
--

DROP TABLE IF EXISTS `portal_portaluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `portal_portaluser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(30) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime NOT NULL,
  `address` varchar(255),
  `phone` varchar(255),
  `reason` varchar(255),
  `resetToken` varchar(255),
  `tokenCreateDate` datetime,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_portaluser`
--

LOCK TABLES `portal_portaluser` WRITE;
/*!40000 ALTER TABLE `portal_portaluser` DISABLE KEYS */;
INSERT INTO `portal_portaluser` VALUES (1,'pbkdf2_sha256$24000$ez6MgHv8irv7$QU+oyHf3FPQ85rE1PWPmePsoj2KohOfQN5NKJUkFcM0=','2016-07-29 10:34:24',0,'ramanareddy438','','','ramanareddymoole@ymail.com',0,1,'2016-07-01 04:22:59','hgfhftyfy','7795358880','jhvftfhgvh',NULL,NULL);
/*!40000 ALTER TABLE `portal_portaluser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_portaluser_groups`
--

DROP TABLE IF EXISTS `portal_portaluser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `portal_portaluser_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `portaluser_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `portal_portaluser_groups_portaluser_id_e3847397_uniq` (`portaluser_id`,`group_id`),
  KEY `portal_portaluser_groups_group_id_025e0d29_fk_auth_group_id` (`group_id`),
  CONSTRAINT `portal_portaluser_groups_group_id_025e0d29_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `portal_portaluser_portaluser_id_51faaccc_fk_portal_portaluser_id` FOREIGN KEY (`portaluser_id`) REFERENCES `portal_portaluser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_portaluser_groups`
--

LOCK TABLES `portal_portaluser_groups` WRITE;
/*!40000 ALTER TABLE `portal_portaluser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_portaluser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_portaluser_user_permissions`
--

DROP TABLE IF EXISTS `portal_portaluser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `portal_portaluser_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `portaluser_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `portal_portaluser_user_permissions_portaluser_id_3f61c1fb_uniq` (`portaluser_id`,`permission_id`),
  KEY `portal_portaluser_u_permission_id_575cf52c_fk_auth_permission_id` (`permission_id`),
  CONSTRAINT `portal_portaluser_portaluser_id_e8b38bb7_fk_portal_portaluser_id` FOREIGN KEY (`portaluser_id`) REFERENCES `portal_portaluser` (`id`),
  CONSTRAINT `portal_portaluser_u_permission_id_575cf52c_fk_auth_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_portaluser_user_permissions`
--

LOCK TABLES `portal_portaluser_user_permissions` WRITE;
/*!40000 ALTER TABLE `portal_portaluser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_portaluser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_portfolio`
--

DROP TABLE IF EXISTS `portal_portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `portal_portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `name` longtext NOT NULL,
  `description` longtext NOT NULL,
  `risk` int(11) NOT NULL,
  `timeframe` longtext NOT NULL,
  `control_market` varchar(1) DEFAULT NULL,
  `investment` double NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `portal_portfolio_user_id_4301c46c_fk_portal_portaluser_id` (`user_id`),
  CONSTRAINT `portal_portfolio_user_id_4301c46c_fk_portal_portaluser_id` FOREIGN KEY (`user_id`) REFERENCES `portal_portaluser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_portfolio`
--

LOCK TABLES `portal_portfolio` WRITE;
/*!40000 ALTER TABLE `portal_portfolio` DISABLE KEYS */;
INSERT INTO `portal_portfolio` VALUES (1,'2016-07-09 12:11:25','2016-07-09 12:11:25','This is sample test','This is sample description',22,'3','S',23245,1),(2,'2016-07-09 12:12:24','2016-07-09 12:12:24','test 2','test descriptio 2',87,'12','N',87234,1),(3,'2016-07-09 12:13:09','2016-07-09 12:13:09','test 3','test descriptio 3',67,'9','D',78232.32,1),(4,'2016-07-09 12:14:58','2016-07-09 12:14:58','test 4','test description 4',45,'10','S',87623.83,1),(5,'2016-07-09 12:15:30','2016-07-09 12:15:30','test 5','test description 5',91,'7','D',12783.98,1),(6,'0000-00-00 00:00:00','0000-00-00 00:00:00','new_portfolio','no stocks',12,'1','N',63433,1);
/*!40000 ALTER TABLE `portal_portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_stock`
--

DROP TABLE IF EXISTS `portal_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `portal_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `ticker` longtext NOT NULL,
  `show_id` int(11) NOT NULL,
  `buy_date` date,
  `current_price` decimal(10,2) NOT NULL,
  `initial_price` decimal(10,2) NOT NULL,
  `number_of_shares` int(11) NOT NULL,
  `sell_date` date,
  PRIMARY KEY (`id`),
  KEY `portal_stock_show_id_41dcc37a_fk_portal_portfolio_id` (`show_id`),
  CONSTRAINT `portal_stock_show_id_41dcc37a_fk_portal_portfolio_id` FOREIGN KEY (`show_id`) REFERENCES `portal_portfolio` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_stock`
--

LOCK TABLES `portal_stock` WRITE;
/*!40000 ALTER TABLE `portal_stock` DISABLE KEYS */;
INSERT INTO `portal_stock` VALUES (15,'0000-00-00 00:00:00','0000-00-00 00:00:00','ABM',1,'2016-07-29',37.24,36.28,48,'2016-09-01'),(16,'2016-08-04 23:39:56','2016-08-04 23:39:56','AWR',1,'2016-07-27',43.16,40.21,23,'2016-09-01'),(17,'2016-08-04 23:39:56','2016-08-04 23:39:56','WTR',1,'2016-07-27',34.39,39.54,40,'2016-09-01'),(18,'2016-08-04 23:39:56','2016-08-04 23:39:56','T',1,'2016-07-27',42.58,30.43,110,'2016-09-01'),(19,'2016-08-04 23:50:01','2016-08-04 23:50:01','CVX',2,'2016-07-27',101.79,101.21,88,'2016-09-01'),(20,'2016-08-04 23:50:01','2016-08-04 23:50:01','CB',2,'2016-07-27',126.13,127.21,36,'2016-09-01'),(21,'2016-08-04 23:50:01','2016-08-04 23:50:01','KO',2,'2016-07-27',43.65,98.21,18,'2016-09-01'),(22,'2016-08-04 23:50:01','2016-08-04 23:50:01','CL',2,'2016-07-27',73.25,89.21,44,'2016-09-01'),(23,'2016-08-04 23:50:01','2016-08-04 23:50:01','GIS',3,'2016-07-27',71.31,74.21,106,'2016-09-01'),(24,'2016-08-04 23:50:01','2016-08-04 23:50:01','FUL',3,'2016-07-27',46.74,40.21,88,'2016-09-01'),(25,'2016-08-04 23:50:01','2016-08-04 23:50:01','IBM',3,'2016-07-27',161.37,200.21,49,'2016-09-01'),(26,'2016-08-04 23:50:01','2016-08-04 23:50:01','KMB',3,'2016-07-27',130.15,150.21,54,'2016-09-01'),(27,'2016-08-04 23:50:01','2016-08-04 23:50:01','KMI',3,'2016-07-27',20.22,40.21,49,'2016-09-01'),(28,'2016-08-04 23:50:01','2016-08-04 23:50:01','LOW',4,'2016-07-27',82.27,60.21,12,'2016-09-01'),(29,'2016-08-04 23:50:01','2016-08-04 23:50:01','MCD',4,'2016-07-27',119.42,115.21,8,'2016-09-01'),(30,'2016-08-04 23:50:01','2016-08-04 23:50:01','NEE',4,'2016-07-27',127.42,130.21,39,'2016-09-01'),(31,'2016-08-04 23:50:01','2016-08-04 23:50:01','NSDN',4,'2016-07-27',88.42,91.21,11,'2016-09-01'),(32,'2016-08-04 23:50:01','2016-08-04 23:50:01','TGD',4,'2016-07-27',74.79,77.21,120,'2016-09-01'),(33,'2016-08-04 23:50:01','2016-08-04 23:50:01','VAL',4,'2016-07-27',107.09,110.21,17,'2016-09-01'),(34,'2016-08-04 23:50:01','2016-08-04 23:50:01','VVC',1,'2016-07-27',51.50,50.21,52,'2016-09-01'),(35,'2016-08-04 23:50:01','2016-08-04 23:50:01','WBA',2,'2016-07-27',79.46,75.21,29,'2016-09-01'),(36,'2016-08-04 23:50:01','2016-08-04 23:50:01','WGL',3,'2016-07-27',73.24,73.21,23,'2016-09-01'),(37,'2016-08-04 23:50:01','2016-08-04 23:50:01','AMZN',3,'2016-07-27',740.83,740.21,18,'2016-09-01'),(38,'2016-08-04 23:50:01','2016-08-04 23:50:01','GOOG',2,'2016-07-27',752.61,700.21,34,'2016-09-01'),(39,'2016-08-04 23:50:01','2016-08-04 23:50:01','APPL',1,'2016-07-27',850.91,800.21,23,'2016-09-01');
/*!40000 ALTER TABLE `portal_stock` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-05  0:45:28
