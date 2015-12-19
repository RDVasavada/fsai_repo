from django.db import models

from portal.models.base import BaseModel

class Portfolio(BaseModel):
    name = models.TextField()
    description = models.TextField()
    risk = models.IntegerField()

    timeframe = models.TextField()
    control_market = models.CharField(max_length=1,
	 	choices=(('S', 'S&P 500'), ('N', 'Nasdaq'), ('D', 'Dow Jones')), default='S', null=True, blank=True)

    investment = models.FloatField()

    user = models.ForeignKey('portal.PortalUser')

    class Meta:
        app_label = 'portal'
