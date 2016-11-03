from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import rotate_token
from stock import get_stocks_by_portfolio
from portal.models.data.stock import Stock
from django.db import connection
from datetime import date
import csv
import time
import random
from django.views.decorators.csrf import csrf_exempt
import requests
import json 
import re
import quandl
from bs4 import BeautifulSoup
from django.http import JsonResponse
from urllib2 import urlopen
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
      picture_url = portalUser.picture_url
  news = requests.get("http://rss2json.com/api.json?rss_url=http://finance.yahoo.com/rss/headline?s=yhoo,msft,tivo,appl,googl,tsla")
  news = news.json()
  newsarr = []
  for newsitem in news['items']:
    newsarr.append(newsitem)
  context_dict = {}
  context_dict['news'] = newsarr
  if picture_url == 'NULL':
    context_dict['picture_url'] = "asdf"
  else:
    context_dict['picture_url'] = picture_url
  stockDict = []
  stockTotal = 0
  oldTotal = 0
  valtotal = 0
  for port in portfolios:
    valtotal += int(re.sub(r'[^\w\s]','',port['value']))
    stocks = get_stocks_by_portfolio(request, str(port['id']))
    for stock in stocks:
      val = stock["current_price"] * stock["number_of_shares"]
      oldTotal += stock['initial_price'] * stock["number_of_shares"]
      stockTotal += val
      prestock = {}
      ticker = stock['ticker']
      prestock[ticker] = {}
      prestock[ticker]['data'] = []
      prestock[ticker]['buy_date'] = stock['buy_date']
      prestock[ticker]['current_price'] = stock['current_price']
      prestock[ticker]['initial_price'] = stock['initial_price']
      prestock[ticker]['number_of_shares'] = stock['number_of_shares']
      timenow = time.strftime("%Y-%m-%d")
      stocks = []
      stocks.append(stockDict)
      stocks = json.dumps(list(stocks), cls=DjangoJSONEncoder)
      context_dict['stockDict'] = stocks
      print(stockTotal)
  try:
    change = stockTotal/oldTotal
    change = change*100
  except ZeroDivisionError:
    change = 0
  context_dict["change"] = "{0:.2f}".format(round(change,2))
  print("this is change !!")
  context_dict["total"] = '{:20,.2f}'.format(valtotal)
  picks = find()
  sentiment = []
  sentiment.append({'stock':'AAPL [Test Portfolio] ','sentiment':'+33'})
  sentiment.append({'stock':'GOOGL [Test Portfolio] ','sentiment':'+23'})
  sentiment.append({'stock':'BAIDU [Test Portfolio] ','sentiment':'-12'})
  sentiment.append({'stock':'VAL [Test Portfolio] ','sentiment':'+28'})
  sentiment.append({'stock':'TSLA [Test Portfolio] ','sentiment':'-12'})
  sentiment.append({'stock':'YHOO [Test Portfolio] ','sentiment':'2'})
  context_dict['sentiment'] = sentiment
  context_dict['picks'] = picks
  context_dict["portfolios"] = portfolios
  context_dict["username"] = username
  t = loader.get_template("user/dashboard.html")
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)

# from bs4 import BeautifulSoup
# from urllib2 import urlopen
# import json
def find():
  chosen = 1
  guru = "https://www.gurufocus.com/api/public/user/c1a72ad16235bed6e762ac34b11d34db:e2285097ad0c7db93e020623fc0022d0/guru/" + str(chosen) + "/aggregated"
  gurusoup = BeautifulSoup(urlopen(guru))
  try:
    g = gurusoup.body.contents[0]
    d = json.loads(g)
  except AttributeError:
    g = gurusoup.p.contents[0]
    d = json.loads(g)   
  guruarr = []
  for key in d:
    for pick in d[key]["port"]:
      guruarr.append(pick)
      if len(guruarr) == 24:
        return guruarr
  return(guruarr)

@login_required
def dashboardskip(request):
  rotate_token(request)
  html = get_top_portfolios(request, 'user/dashboard.html')
  return HttpResponse(html)

@csrf_exempt
def portfolio_chart(request, portfolio_id):
  if request.user.is_authenticated():
      username = request.user.username
      portalUser = PortalUser.objects.get(username=username)
      portfolios = top_portfolios(request, portalUser.id)
  stocks = get_stocks_by_portfolio(request, portfolio_id)
  portDate = []
  portVolume = []
  portClose = []
  portAverage = []
  for stock in stocks:
    today = date.today()
    print(today)
    end = today.replace(year=today.year - 1)
    print(end)
    u = "EOD/" + str(stock['ticker'])
    mydata = quandl.get(u, start_date=end, end_date=today)
    if len(portDate) == 0:
      for item in mydata.index:
        portDate.append(str(item)[0:10])
      for item in mydata['Close']:
        portClose.append(float(item))
        portAverage.append(float(item))
      for item in mydata['Volume']:
        portVolume.append(float(item))
    else:
      incomingClose = []
      incomingVolume = []
      incomingAverage = []
      for item in mydata['Close']:
        incomingClose.append(float(item))
        incomingAverage.append(float(item))
      for item in mydata['Volume']:
        incomingVolume.append(float(item))
      portClose = map(sum, zip(portClose, incomingClose))
      portVolume = map(sum, zip(portVolume, incomingVolume))
      portAverage = map(sum, zip(portAverage, incomingAverage))    
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['Date', 'Volume', 'Close', 'Average'])
  for item in portDate:
    print(item)
    writer.writerow([portDate.pop(0),portVolume.pop(0),portClose.pop(0),portAverage.pop(0)])
  return response

@csrf_exempt
def stock_chart(request, stock_name):
  portDate = []
  portVolume = []
  portClose = []
  portAverage = []
  today = date.today()
  print(today)
  end = today.replace(year=today.year - 1)
  u = "EOD/" + str(stock_name)
  mydata = quandl.get(u, start_date=end, end_date=today)
  print(mydata)
  for item in mydata.index:
    print(str(item)[0:10])
    portDate.append(str(item)[0:10])
  for item in mydata['Close']:
    portClose.append(float(item))
    portAverage.append(float(item))
  for item in mydata['Volume']:
    portVolume.append(float(item))
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['Date', 'Volume', 'Close', 'Average'])
  for item in mydata.index:
    writer.writerow([portDate.pop(0),portVolume.pop(0),portClose.pop(0),portAverage.pop(0)])
  print(response)
  return response
