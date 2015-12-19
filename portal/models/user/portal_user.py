from django.db import models
from django import forms
from django.contrib import auth


class PortalUser(auth.models.AbstractUser):

    phone = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    reason = models.CharField(max_length=255, null=True, blank=True)
    resetToken = models.CharField(max_length=255, null=True, blank=True)
    tokenCreateDate = models.DateTimeField(auto_now=False, auto_now_add=False, null=True, blank=True)

    class Meta:
        app_label = 'portal'
