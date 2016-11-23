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
from random import randint
import time
import random
from django.views.decorators.csrf import csrf_exempt
import requests
import json 
import re
import quandl
import pandas as pd
import numpy as np
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

@csrf_exempt
def marketnews(request):
  news = requests.get("http://rss2json.com/api.json?rss_url=http://finance.yahoo.com/rss/headline?s=yhoo,msft,tivo,appl,googl,tsla")
  news = news.json()
  newsarr = []
  for newsitem in news['items']:
    newsarr.append(newsitem)
  return JsonResponse({'news':newsarr})

@csrf_exempt
def your_sentiment(request):
  cursor = connection.cursor()
  if request.user.is_authenticated():
     username = request.user.username
     portalUser = PortalUser.objects.get(username=username)
  cursor.execute("select id from portal_portfolio WHERE user_id = '" + str(portalUser.id) + "' limit 4")
  idArr = []
  stockTickerArr = []
  for portfolio in dictfetchall(cursor):
    idArr.append(str(portfolio['id']))
  for xid in idArr:
    cursor.execute("select distinct ticker from portal_stock where show_id = '" + str(xid) + "' limit 30")
    for sentiment_stock in dictfetchall(cursor):
        stockTickerArr.append(sentiment_stock['ticker'])
  sentimentObj =[]
  with open("sentiment.csv") as f:
      reader = csv.reader(f)
      for row in reader:
          if any(row[0] in s for s in stockTickerArr):
            if row[1] == '2016-11-11':
              sentimentObj.append({'ticker':row[0],'date':row[1],'sentiment':row[2],'impact':row[3]})
          if len(sentimentObj) == 10:
            break
  return JsonResponse({'sentiment':sentimentObj})

@csrf_exempt
def top_picks(request):
  picks = find()
  return JsonResponse({'picks':picks})

@csrf_exempt
def get_gain(request):
   gainArr = []
   portArr = []
   if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(request,portalUser.id)
    for port in portfolios:
      cursor = connection.cursor()
      portChangeArr = []
      cursor.execute("select current_price, initial_price from portal_stock where show_id=" + str(port['id']))
      for a in dictfetchall(cursor):
          denom = float(a['initial_price'])
          if float(a['initial_price']) == 0 :
            denom = 1
          tgain = (float(a['current_price']) / denom )
          portChangeArr.append(tgain)
          gainArr.append(tgain)
      portChange =  np.average(portChangeArr)
      portArr.append(portChange)
    gain = np.average(gainArr)
   return JsonResponse({'data':gain, 'ports':portArr})

@csrf_exempt
def performance_line_chart(request):
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['symbol', 'date', 'price'])
  end = datetime.date.today()
  start = (end - datetime.timedelta(days=365))
  if request.user.is_authenticated():
     username = request.user.username
     portalUser = PortalUser.objects.get(username=username)
  portfolios = top_portfolios(request,portalUser.id)
  cursor = connection.cursor()
  returnarr = []
  imparr = []
  return_date_arr = []
  for item in portfolios:
    cursor.execute("SELECT ticker from portal_stock where show_id = \'" + str(item['id']) + "'")
    newarr = []
    for stock in dictfetchall(cursor):
      datearr = []
      stockarr = []
      try:
        cursor.execute("SELECT Adj_Close, last_date FROM stock_" + str(stock['ticker']) + " WHERE last_date BETWEEN '" + str(start) + "' AND '" + str(end) + "'")
        first_price = 0
        if len(newarr) == 0:
          for s_val in dictfetchall(cursor):
              newarr.append(0)
              return_date_arr.append(s_val['last_date'])
        if len(stockarr) == 0:
          for s_val in dictfetchall(cursor):
            if first_price == 0:
              first_price = s_val['Adj_Close']
            stockarr.append(s_val['Adj_Close'])
            datearr.append(s_val['last_date'])
        count = 1
        for x in datearr:
          a = stockarr[count]
          b = stockarr[count - 1]
          c = (float(a)/float(first_price))
          newarr[count] = c
          count += 1
      except:
        print("oh well")
    if len(returnarr) == 0 :
      returnarr = newarr
    else:
      imparr = newarr
      returnarr = [(x+y)/2 for x,y in zip(imparr/returnarr)]
  returnarr[0] = 1
  for line in returnarr:
    print(return_date_arr.pop(0))
    writer.writerow(['You',str(return_date_arr.pop(0))[0:10],returnarr.pop(0)])
  valarr = []
  datearr = []
  last = 0
  with open('ndx.json') as json_data:
    ndx = json.load(json_data)
    for item in ndx['data']:
      if last == 0:
        last = item[1]
      if start <= datetime.datetime.strptime(item[0], '%Y-%m-%d').date() <= end:
        change = float(item[1])/float(last)
        change = change * change 
        datearr.append(item[0])
        valarr.append(change)
  datearr.pop(0)
  valarr.pop(0)
  for item in valarr:
    print(datearr.pop())
    writer.writerow(['Nasdaq',str(datearr.pop()),valarr.pop()])
  valarr = []
  datearr = []
  last = 0
  with open('sp.json') as json_data:
    sp = json.load(json_data)
    for item in sp['data']:
      if last == 0:
        last = item[1]
      if start <= datetime.datetime.strptime(item[0], '%Y-%m-%d').date() <= end:
        change = float(item[1])/float(last)
        change = change * change 
        datearr.append(item[0])
        valarr.append(change)
  datearr.pop(0)
  valarr.pop(0)        
  for item in valarr:
    print(datearr.pop())
    writer.writerow(['S&P 500',datearr.pop(),valarr.pop()])
  l_valarr = []
  l_datearr = []
  last = 0
  with open('dj.json') as json_data:
    dj = json.load(json_data)
    for item in dj['dataset']['data']:
      if last == 0:
        last = item[1]
      if start <= datetime.datetime.strptime(item[0], '%Y-%m-%d').date() <= end:
        change = float(item[1])/float(last)
        change = change * change 
        l_datearr.append(item[0])
        l_valarr.append(change)
  for item in valarr:
    print(l_datearr.pop())
    writer.writerow(['Dow Jones',l_datearr.pop(),l_valarr.pop()])
  return response
  # return response
   # gainArr = []
   # portArr = []
   # if request.user.is_authenticated():
   #  username = request.user.username
   #  portalUser = PortalUser.objects.get(username=username)
   #  portfolios = top_portfolios(request,portalUser.id)
   #  for port in portfolios:
   #    cursor = connection.cursor()
   #    portChangeArr = []
   #    cursor.execute("select ticker from portal_stock where show_id=" + str(port['id']))
   #    for a in dictfetchall(cursor):
   #        denom = float(a['initial_price'])
   #        print(denom)
   #        if float(a['initial_price']) == 0 :
   #          denom = 1
   #        tgain = (float(a['current_price']) / denom )
   #        print(tgain)
   #        portChangeArr.append(tgain)
   #        gainArr.append(tgain)
   #    portChange =  np.average(portChangeArr)
   #    portArr.append(portChange)
   #  gain = np.average(gainArr)

@csrf_exempt
def performance_chart(request):
  with open('ndx.json') as json_data:
    ndx = json.load(json_data)
  with open('dj.json') as json_data:
    dj = json.load(json_data)
  with open('sp.json') as json_data:
    sp = json.load(json_data)    
  gainArr = []
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(request,portalUser.id)
    for port in portfolios:
     cursor = connection.cursor()
     cursor.execute("select current_price, initial_price from portal_stock where show_id=" + str(port['id']))
     for a in dictfetchall(cursor):
          denom = float(a['initial_price'])
          if float(a['initial_price']) == 0 :
            denom = 1
          tgain = (float(a['current_price']) - float(a['initial_price'])) / denom
          gainArr.append(tgain)
  gain = np.average(gainArr) 
  multipler = "0." + str(randint(8,9)) 
  multipler2 = "0." + str(randint(7,8)) 
  gain2 = gain*float(multipler)
  gain3 = gain*float(multipler2)
  return JsonResponse({'ndx':ndx,'sp':sp,'dj':dj,'you':[gain,gain2,gain3]})


@csrf_exempt
def portfolio_value(request):
  context_dict = {}
  if request.user.is_authenticated():
      username = request.user.username
      portalUser = PortalUser.objects.get(username=username)
      portfolios = top_portfolios(request,portalUser.id)
      stockDict = []
      stockTotal = 0
      oldTotal = 0
      valtotal = 0
      performanceval = 0
      for port in portfolios:
        valtotal += int(port['investing_amount'])
        stocks = get_stocks_by_portfolio(request, str(port['id']))
        for stock in stocks:
          val = int(stock["current_price"]) * int(stock["number_of_shares"])
          performanceval += stock['current_price']
          oldTotal += stock['initial_price'] * int(stock["number_of_shares"])
          stockTotal += val
          prestock = {}
          ticker = stock['ticker']
          prestock[ticker] = {}
          prestock[ticker]['data'] = []
          prestock[ticker]['buy_date'] = stock['buy_date']
          prestock[ticker]['current_price'] = stock['current_price']
          prestock[ticker]['initial_price'] = stock['initial_price']
          prestock[ticker]['number_of_shares'] = int(stock['number_of_shares'])
          timenow = time.strftime("%Y-%m-%d")
          stocks = []
          stocks.append(stockDict)
          stocks = json.dumps(list(stocks), cls=DjangoJSONEncoder)
          context_dict['stockDict'] = stocks
      try:
        change = stockTotal/oldTotal
        change = change*100
      except ZeroDivisionError:
        change = 0
      context_dict["change"] = "{0:.2f}".format(round(change,2))
      context_dict["total"] = '{:20,.2f}'.format(valtotal)
      context_dict["performanceval"] = '{:20,.2f}'.format(performanceval)
      return JsonResponse({'data':context_dict})

@login_required
def dashboard(request):
  sectorList = {}
  if request.user.is_authenticated():
      username = request.user.username
      portalUser = PortalUser.objects.get(username=username)
      portfolios = top_portfolios(request,portalUser.id)
      picture_url = portalUser.picture_url
      cursor = connection.cursor()
      cursor.execute("SELECT id from portal_portfolio where user_id = \'" + str(portalUser.id) + "'")
      for stock in dictfetchall(cursor):
        showid = stock['id']
        print(showid)
        cursor.execute("SELECT sector from portal_stock where show_id = \'" + str(showid) + "'")
        for sector in dictfetchall(cursor):
          print(sector)
          if str(sector['sector']) in sectorList:
            sectorList[str(sector['sector'])]['value'] += 1
          else:
            sectorList[str(sector['sector'])] = {}
            sectorList[str(sector['sector'])]['sector'] = str(sector['sector'])
            sectorList[str(sector['sector'])]['value'] = 1
  context_dict = {}
  context_dict['sectors'] = sectorList
  if picture_url == 'NULL':
    context_dict['picture_url'] = "asdf"
  else:
    context_dict['picture_url'] = picture_url
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
    g = gurusoup.body.contents[0]
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
