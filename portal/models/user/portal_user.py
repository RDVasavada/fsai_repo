from django.db import models
from django import forms
from django.contrib import auth


class PortalUser(auth.models.AbstractUser):

    phone = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    reason = models.CharField(max_length=255, null=True, blank=True)
    resetToken = models.CharField(max_length=255, null=True, blank=True)
    connections = models.CharField(max_length=255, null=True, blank=True)
    picture_url = models.CharField(max_length=255, null=True, blank=True)
    tokenCreateDate = models.DateTimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    confirm_email = models.CharField(max_length=255, null=True, blank=True)
    confirm_phone = models.CharField(max_length=255, null=True, blank=True)
    firmname = models.CharField(max_length=255, null=True, blank=True)
    firmsize = models.CharField(max_length=255, null=True, blank=True)
    assets = models.CharField(max_length=255, null=True, blank=True)
    pin_number = models.IntegerField()

    def __str__(self):
        return str(self.id) + "|" + self.username + "|" + self.phone + "|" + self.first_name + "|" + self.last_name + "|" + self.connections

    class Meta:
        app_label = 'portal'
# mysql -u root -p fsai -e "alter table portal_portaluser add column firmname varchar(255) not null"
# mysql -u root -p fsai -e "alter table portal_portaluser add column firmsize varchar(255) not null"
# mysql -u root -p fsai -e "alter table portal_portaluser add column assets varchar(255) not null"
# Enter password:
# Enter password:
# Enter password:
# mysql -u root -p fsai -e "alter table portal_portaluser change column f_name first_name varchar(255) not null"
# mysql -u root -p fsai -e "alter table portal_portaluser change column l_name last_name varchar(255) not null"CREATE TABLE `portal_portaluser` (
# mysql -u root -p fsai -e "CREATE TABLE portal_portaluser (id int(11) NOT NULL AUTO_INCREMENT, password varchar(128) NOT NULL, last_login datetime(6) DEFAULT NULL, is_superuser tinyint(1) NOT NULL, username varchar(30) NOT NULL, first_name varchar(255) NOT NULL, last_name varchar(255) NOT NULL, email varchar(254) NOT NULL, is_staff tinyint(1) NOT NULL, is_active tinyint(1) NOT NULL, date_joined datetime(6) NOT NULL, phone varchar(255) DEFAULT NULL, address varchar(255) DEFAULT NULL, reason varchar(255) DEFAULT NULL, resetToken varchar(255) DEFAULT NULL, connections varchar(255) DEFAULT NULL, picture_url varchar(255) DEFAULT NULL, tokenCreateDate datetime(6) DEFAULT NULL, confirm_email varchar(6) DEFAULT NULL, confirm_phone varchar(6) DEFAULT NULL, pin_number int(11) NOT NULL, firmname varchar(255) NOT NULL, firmsize varchar(255) NOT NULL, assets varchar(255) NOT NULL, PRIMARY KEY (id), UNIQUE KEY username (username) ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1

# CREATE TABLE `portal_stock` (
#   `id` int(11) NOT NULL AUTO_INCREMENT,
#   `created_date` datetime(6) NOT NULL,
#   `update_date` datetime(6) NOT NULL,
#   `ticker` longtext NOT NULL,
#   `show_id` int(11) NOT NULL,
#   `buy_date` date DEFAULT NULL,
#   `sell_date` date DEFAULT NULL,
#   `current_price` decimal(10,2) NOT NULL,
#   `initial_price` decimal(10,2) NOT NULL,
#   `allocation` longtext NOT NULL,
#   `sentiment` longtext NOT NULL,
#   `company_name` longtext NOT NULL,
#   `sector` longtext NOT NULL,
#   `number_of_shares` int(11) NOT NULL,
#   PRIMARY KEY (`id`)
# ) ENGINE=InnoDB AUTO_INCREMENT=358 DEFAULT CHARSET=latin1 |

