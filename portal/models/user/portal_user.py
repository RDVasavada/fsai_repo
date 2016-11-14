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
    confirm_email = models.BooleanField(default=False)
    confirm_phone = models.BooleanField(default=False)
    pin_number = models.IntegerField()

    def __str__(self):
        return str(self.id) + "|" + self.username + "|" + self.phone + "|" + self.first_name + "|" + self.last_name + "|" + self.connections

    class Meta:
        app_label = 'portal'
