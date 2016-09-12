from django.db import models

from portal.models.base import BaseModel
from portal.models.data.portfolio import Portfolio

class Stock(BaseModel):
    ticker = models.TextField()
    show = models.ForeignKey(Portfolio)
    buy_date = models.DateField(null=True)
    sell_date = models.DateField(null=True)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    initial_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    number_of_shares = models.IntegerField(default=0)

    class Meta:
        app_label = 'portal'
