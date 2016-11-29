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
# Tas-MacBook-Pro:reacttest ta$ mysql -u root -p fsai -e "alter table portal_portaluser add column firmname varchar(255) not null"
# Enter password:
# Tas-MacBook-Pro:reacttest ta$ mysql -u root -p fsai -e "alter table portal_portaluser add column firmsize varchar(255) not null"
# Enter password:
# Tas-MacBook-Pro:reacttest ta$ mysql -u root -p fsai -e "alter table portal_portaluser add column assets varchar(255) not null"
# Enter password:
# mysql -u root -p fsai -e "alter table portal_portaluser change column f_name first_name varchar(255) not null"
# mysql -u root -p fsai -e "alter table portal_portaluser change column l_name last_name varchar(255) not null"