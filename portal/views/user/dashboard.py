from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import rotate_token
from stock import get_stocks_by_portfolio
from portal.models.data.stock import Stock
from django.db import connection
from datetime import date
import time
import datetime
import csv
from decimal import Decimal
import time
import random
from django.views.decorators.csrf import csrf_exempt
import requests
import json 
import re
import quandl
import pandas as pd
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
quandl.ApiConfig.api_key = 'X8CjGKTPEqTuto2v_Q94'

    

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
  performanceval = 0
  for port in portfolios:
    valtotal += int(re.sub(r'[^\w\s]','',port['value']))
    stocks = get_stocks_by_portfolio(request, str(port['id']))
    for stock in stocks:
      val = stock["current_price"] * stock["number_of_shares"]
      performanceval += stock['current_price']
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
  context_dict["performanceval"] = '{:20,.2f}'.format(performanceval)
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
  except TypeError:
    g = gurusoup.p.contents[0]
    d = json.loads(g)   
  guruarr = []
  for key in d:
    for pick in d[key]["port"]:
      guruarr.append(pick)
      if len(guruarr) == 24:
        return guruarr
  return(guruarr)

def getListOfStocks(request,user_id):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(request, portalUser.id)

# def get_portfolio_Data(request,  x /d )

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
    end = today.replace(year=today.year - 1)
    today = str(today) + " 00:00:00"
    end = str(end) + " 00:00:00"
    cursor = connection.cursor()
    try:
      cursor.execute("SELECT last_date, Adj_Close, Adj_High, Adj_Low from stock_" + str(stock['ticker']) + " "
                    "WHERE DATE(last_date) > '%s'" %(end))
      if len(portDate) == 0:
        for item in dictfetchall(cursor):
          portDate.append(str(item['last_date'])[0:10])
          portVolume.append(float(str(item['Adj_Low'])[:10]))
          portClose.append(float(str(item['Adj_Close'])[:10]))
          portAverage.append(float(str(item['Adj_High'])[:10]))
      else:
        incomingClose = []
        incomingVolume = []
        incomingAverage = []
        for item in dictfetchall(cursor):
          incomingClose.append(float(str(item['Adj_Close'])))
          incomingAverage.append(float(str(item['Adj_High'])))
          incomingVolume.append(float(str(item['Adj_Low'])))
        if len(incomingClose) > 0:
          portClose = map(sum, zip(portClose, incomingClose))
          portVolume = map(sum, zip(portVolume, incomingVolume))
          portAverage = map(sum, zip(portAverage, incomingAverage))
        print(incomingClose)
    except:
      print("err")
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['Date', 'Volume', 'Close', 'Average'])
  for item in portDate:
    writer.writerow([portDate.pop(0),portVolume.pop(0),portClose.pop(0),portAverage.pop(0)])
  return response

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    

@csrf_exempt
def stock_chart(request, stock_name):
  portDate = []
  portVolume = []
  portClose = []
  portAverage = []
  today = date.today()
  end = today.replace(year=today.year - 1)
  today = str(today) + " 00:00:00"
  end = str(end) + " 00:00:00"
  cursor = connection.cursor()
  cursor.execute("SELECT last_date, Adj_Close, Adj_High, Adj_Low from stock_" + str(stock_name) + " "
                "WHERE DATE(last_date) > '%s'" %(end))
  for item in dictfetchall(cursor):
    print(item['last_date'])
    portDate.append(str(item['last_date'])[:10])
    portVolume.append(item['Adj_Low'])
    portClose.append(item['Adj_Close'])
    portAverage.append(item['Adj_High'])
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['Date', 'Volume', 'Close', 'Average'])
  for item in portDate:
    writer.writerow([portDate.pop(0),portVolume.pop(0),portClose.pop(0),portAverage.pop(0)])
  # print(response)
  return response
