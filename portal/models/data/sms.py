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



