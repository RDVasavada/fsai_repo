from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
import json
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from portal.models.data.stock import Stock
from portal.views.user.portfolio import get_top_portfolios

@login_required
def portfolio(request):
    # write code to get portfolio information from database
    # portfolio_Objects = Portfolio.objects.all()
    html = get_top_portfolios(request, 'user/portfolio_view.html')
    return HttpResponse(html)
