from django.db import models

from portal.models.base import BaseModel

class Stock(BaseModel):
    ticker = models.TextField()
    show = models.ForeignKey('portal.Portfolio')

    class Meta:
        app_label = 'portal'
