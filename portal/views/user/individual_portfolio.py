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
from portal.views.user import top_portfolios
from stock import get_stocks_by_portfolio

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    

@csrf_exempt
@login_required
def individual_portfolio(request, portfolio_id):
    sectorList = {}
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
        portfolios = top_portfolios(request, portalUser.id)
        cursor = connection.cursor()
        showid = str(portfolio_id)
        cursor.execute("SELECT sector from portal_stock where show_id = \'" + str(showid) + "'")
        for sector in dictfetchall(cursor):
          if str(sector['sector']) in sectorList:
            sectorList[str(sector['sector'])]['value'] += 1
          else:
            sectorList[str(sector['sector'])] = {}
            sectorList[str(sector['sector'])]['sector'] = str(sector['sector'])
            sectorList[str(sector['sector'])]['value'] = 1
    stocks = get_stocks_by_portfolio(request, portfolio_id)
    portfolio = Portfolio.objects.get(id=portfolio_id)
    change = range(1, 100, 1)
    context_dict = {}
    context_dict['sectors'] = sectorList
    context_dict["portfolios"] = portfolios
    context_dict["stocks"] = stocks
    context_dict["change"] = change
    context_dict["portfolio"] = portfolio
    t = loader.get_template('user/individual_portfolio.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    return HttpResponse(html)                    




