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

@csrf_exempt
@login_required
def individual_portfolio(request, portfolio_id):
    print(portfolio_id)
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
        portfolios = top_portfolios(request, portalUser.id)
    stocks = get_stocks_by_portfolio(request, portfolio_id)
    portfolio = Portfolio.objects.get(id=portfolio_id)
    market_sentiment = range(1, 100, 1)
    change = range(1, 100, 1)
    context_dict = {}
    context_dict["portfolios"] = portfolios
    context_dict["stocks"] = stocks
    context_dict["change"] = change
    context_dict["portfolio"] = portfolio
    context_dict["market_sentiment"] = market_sentiment
    t = loader.get_template('user/individual_portfolio.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    return HttpResponse(html)                    




