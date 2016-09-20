DROP TABLE IF EXISTS `portal_messageheader`;
CREATE TABLE `portal_messageheader` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `from_id` int(11) UNSIGNED NOT NULL,
  `to_id` int(11) UNSIGNED NOT NULL,
  `subject` varchar(127) NOT NULL,
  `time` datetime NOT NULL,  
  `status` varchar(127) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `portal_message`;
CREATE TABLE `portal_message` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `header_id` int(11) UNSIGNED NOT NULL,
  `is_from_sender` int(11) UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

