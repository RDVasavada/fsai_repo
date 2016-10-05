from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import rotate_token
from stock import get_stocks_by_portfolio
import time
import requests
import json 
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.template import RequestContext, Context, loader
from portal.models.user.portal_user import PortalUser
from portal.views.user.top_portfolios import top_portfolios
from portal.views.user.top_portfolios import get_top_portfolios
from yahoo_finance import Share
from portal.models.data.portfolio import Portfolio
@login_required
def dashboard(request):
  if request.user.is_authenticated():
      username = request.user.username
      portalUser = PortalUser.objects.get(username=username)
      portfolios = top_portfolios(request,portalUser.id)
  context_dict = {}
  stockDict = []
  for port in portfolios:
    stocks = get_stocks_by_portfolio(request, str(port['id']))
    for stock in stocks:
      prestock = {}
      ticker = stock['ticker']
      prestock[ticker] = {}
      prestock[ticker]['data'] = []
      prestock[ticker]['buy_date'] = stock['buy_date']
      prestock[ticker]['current_price'] = stock['current_price']
      prestock[ticker]['initial_price'] = stock['initial_price']
      prestock[ticker]['number_of_shares'] = stock['number_of_shares']
      timenow = time.strftime("%Y-%m-%d")
      # historical = Share(str(stock['ticker']))
      # historical = historical.get_historical(str(stock['buy_date']),timenow)
      # try:
      #   for share in historical:
      #     # print(share)
      #     prestock[ticker]['data'].append(share['Close'])
          # prestock['historical'].append(share['Close'])
      # except IndexError:
      #   print("e")
      # stockDict.append(prestock)
    stocks = []
    stocks.append(stockDict)

    # for data in historical:
    #   prestock['historical'].append(data)
    #   print(prestock['historical'])
    # print(historical)
  stocks = json.dumps(list(stocks), cls=DjangoJSONEncoder)
  print(stocks)
  context_dict['stockDict'] = stocks
  context_dict["portfolios"] = portfolios
  context_dict["username"] = username
  t = loader.get_template("user/dashboard.html")
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)

@login_required
def dashboardskip(request):
  rotate_token(request)
  html = get_top_portfolios(request, 'user/dashboard.html')
  return HttpResponse(html)
