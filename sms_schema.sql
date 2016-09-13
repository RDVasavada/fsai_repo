DROP TABLE IF EXISTS `portal_sms`;
CREATE TABLE `portal_sms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  `phone_number` varchar(255),
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `analysis` varchar(255) NOT NULL,
  `resolution` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `portal_sms` WRITE;

INSERT INTO `portal_sms` VALUES (1,'2016-07-09 12:11:25','9492459949','1','This is sample description', 'Unresolved','Unresolved'),(2,'2016-07-09 12:11:25','9492459949','1','This is sample description', 'Unresolved','Unresolved'),(3,'2016-07-09 12:11:25','9492459949','27','This is sample description', 'Unresolved','Unresolved');

UNLOCK TABLES;