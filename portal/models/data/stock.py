from django.db import models

from portal.models.base import BaseModel
from portal.models.data.portfolio import Portfolio

class Stock(BaseModel):
    ticker = models.TextField()
    show = models.ForeignKey(Portfolio)

    class Meta:
        app_label = 'portal'
