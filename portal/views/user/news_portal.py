import numpy as np
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
import json
import csv
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from django.http import JsonResponse
from portal.models.data.stock import Stock
from portal.views.user import top_portfolios

@login_required
@csrf_exempt
def get_stock_sentiment(request, stock_name):
    cursor = connection.cursor()
    cursor.execute("SELECT sentiment FROM portal_stock WHERE ticker = \'" + str(stock_name) + "' LIMIT 1")
    for s_score in dictfetchall(cursor):
      return JsonResponse({'score':s_score['sentiment']})

@login_required
@csrf_exempt
def get_stock_news(request, stock_name):
    cursor = connection.cursor()
    cursor.execute("SELECT company_name FROM portal_stock WHERE ticker = \'" + str(stock_name) + "' LIMIT 1")
    for d_score in dictfetchall(cursor):
      cnstring = str(d_score['company_name']).split()
      print(cnstring)
      try:
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1cf6ae6247764c28824a8f160cf73c75&sort=newest&q=" + cnstring[0]
        news = requests.get(url)
        rtnjson = news.json()
        return JsonResponse({'news':rtnjson}) 
      except:
        return JsonResponse({'news':"none"}) 

@csrf_exempt
def stock_sentiment_graph(request, stock_name):
  with open("sentiment.csv") as f:
      reader = csv.reader(f)
      for row in reader:
        if len(sentimentarr) > 50:
            break
        if str(row[0]) in str(data_dict['new_tickers'][count]):
          if str(row[1])[0:5] in '2016-11-11':
            stock_sentiment = (float(row[2])*100)+50
            sentimentarr.append(stock_sentiment)

@csrf_exempt
def getnews(request):
  if request.user.is_authenticated():
     username = request.user.username
     portalUser = PortalUser.objects.get(username=username)
  cursor = connection.cursor()
  cursor.execute("select id from portal_portfolio WHERE user_id = '" + str(portalUser.id) + "' ")
  idArr = []
  newsarr = []
  for portfolio in dictfetchall(cursor):
    idArr.append(str(portfolio['id']))
  for xid in idArr:
    cursor.execute("select ticker, company_name from portal_stock where show_id = '" + str(xid) + "' LIMIT 5")  
    for dist_ticker in dictfetchall(cursor):
      cn = str(dist_ticker['company_name']).split()
      cnstring = str(cn[0] + " " + cn[1])
      url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1cf6ae6247764c28824a8f160cf73c75&sort=newest&q=" + cnstring
      news = requests.get(url)
      newsarr.append(news.json())
  return JsonResponse({'news':newsarr})

@login_required
def news_portal(request):
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
        # Get User information from username
        # get the portfolios of the user
        # print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))
        try:
            all_portfolios = Portfolio.objects.filter(user__id=portalUser.id)
            # all_portfolios = Portfolio.objects.filter(user__id=1)
            #print(all_portfolios)

            #all_portfolios = Portfolio.objects.raw('SELECT * FROM portal_portfolio WHERE user_id = %s', [portalUser.id])
            #print(all_portfolios)
            for port in all_portfolios:
                # print(str(port.id) + "|" + port.name)
                port.stocks = port.stock_set.all()
                #print(port.stock_set.all())
                #for stock in port.stock_set:
                    #print(str(stock.id) + " | " + stock.ticker)


            #for p in Portfolio.objects.raw('SELECT * FROM portal_portfolio WHERE user_id = %s', [portalUser.id]):
                #print(p)

            #user_portfolios = Portfolio.objects.filter(user_id=portalUser.id)
            #length = len(user_portfolios)
            #print(length)
        except Exception as e:
            print(e)
            all_portfolios = None

        #print(str(user_portfolios))
        #print("user_portfolios: " + str(len(user_portfolios)))
        #for uportfolio in user_portfolios:
            #print(uportfolio)
            #for stock in uportfolio.entry_set.all():
                #print(stock)
        #print(user_portfolios)
    else:
        print("authentication is not successful")
    # print "adam's ports"
    # for port in all_portfolios:
    #     print len(port.stocks)
    context_dict = {}
    context_dict["all_portfolios"] = all_portfolios
    context_dict["username"] = username
    t_portfolios = top_portfolios(request, portalUser.id)
    context_dict["portfolios"] = t_portfolios
    t = loader.get_template('user/news_portal.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    #print(html)
    return HttpResponse(html)

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

@csrf_exempt
def scatter(request, stock_name):
    context_dict={}
    t = loader.get_template('user/ScatterTest.html')
    c = Context(context_dict)
    html = t.render(context_dict)  
    return HttpResponse(html)

@login_required
@csrf_exempt
def sentiment_data(request, stock_name):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="data.csv"'
    writer = csv.writer(response)
    writer.writerow(['ticker', 'date', 'article_sentiment', 'impact_score'])
    if request.user.is_authenticated():
          userid = request.user.id
    cursor = connection.cursor()
    with open("sentiment.csv") as f:
          reader = csv.reader(f)
          for row in reader:
              if str(stock_name) in row[0]:
                writer.writerow([row[0],row[1],row[2],row[3]])
    return response

@login_required
@csrf_exempt
def portfolio_sentiment_data(request, id):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
  cursor = connection.cursor()
  cursor.execute("select ticker,allocation from portal_stock where show_id = '" + str(id) + "'")  
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['ticker', 'date', 'article_sentiment', 'impact_score'])
  for stock in dictfetchall(cursor):
    sentimentarr = []
    date = ""
    with open("sentiment.csv") as f:
          reader = csv.reader(f)
          for row in reader:
              if len(sentimentarr) < 50:
                if str(row[0]) in str(stock['ticker']):
                  sentimentarr.append(float(row[2]))
                  date = str(row[1])
    sentiment_value = (np.average(sentimentarr))+50
    writer.writerow([str(stock['ticker']),date,sentiment_value,str(stock['allocation'])])
    print(stock['allocation'])
  return response

    
