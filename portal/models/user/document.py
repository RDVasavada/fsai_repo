
from django import forms
from django.contrib import auth
# -*- coding: utf-8 -*-
from django.db import models
from portal.models.base import BaseModel

class Document(BaseModel):
    docfile = models.FileField(upload_to='documents/%Y/%m/%d')

    user = models.ForeignKey('portal.PortalUser')

    #def __init__(self):
        #super(self)

    '''
    def __init__(self, name=name, description=description, risk=risk, timeframe=timeframe, control_market=control_market,
                 inv destment=investment, user=user):
        super(Portfolio, self).__init__(name=name, description=description, risk=risk, timeframe=timeframe, control_market=control_market,
                 investment=investment, user=user)
        self.name = name
        self.description = description
        self.risk = risk
        self.timeframe = timeframe
        self.control_market = control_market
        self.investment = investment
        self.user = user
    '''

    class Meta:
        app_label = 'portal'
