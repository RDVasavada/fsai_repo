from django.db import models

from portal.models.base import BaseModel

class Sms(BaseModel):
    phone_number = models.IntegerField()
    user_id = models.IntegerField()
    message = models.TextField()
    analysis = models.TextField()
    resolution = models.TextField()

    def __str__(self):
        return str(self.message) + "|" + self.phone_number

    class Meta:
        app_label = 'Sms'





# CREATE TABLE `portal_sms` (
#   `id` int(11) NOT NULL AUTO_INCREMENT,
#   `phone_number` varchar(15) NOT NULL,
#   `message` varchar(255) NOT NULL,
#   `resolution` varchar(255) NOT NULL,
#   `date_created` datetime(6) NOT NULL,
#   `user_id` int(11) DEFAULT NULL,
#   `analysis` varchar(255) NOT NULL,
#   PRIMARY KEY (`id`),
#   KEY `user_id` (`user_id`),
#   CONSTRAINT `portal_sms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `portal_portaluser` (`id`)
# ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 |