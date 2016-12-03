
import numpy as np
from random import shuffle
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import datetime
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
    a = ""
    for new_score in dictfetchall(cursor):
      a = new_score['sentiment']  
    print(a)
    return JsonResponse({'score':a})

@login_required
@csrf_exempt
def get_stock_news(request, stock_name):
    cursor = connection.cursor()
    cursor.execute("SELECT company_name FROM portal_stock WHERE ticker = \'" + str(stock_name) + "' LIMIT 1")
    for dscore in dictfetchall(cursor):
      try:
        print(str(dscore['company_name']))
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=5e4b878121fc4daf91d5c3625e34a51a&sort=newest&q=" + str(d_score['company_name'])
        news = requests.get(url)
        rtnjson = news.json()
        print(rtnjson)
        return JsonResponse({'news':rtnjson}) 
      except:
        return JsonResponse({'news':"no news"}) 

@login_required
@csrf_exempt
def get_portfolio_sentiment(request, port_id):
    sentiment_avg = []
    cursor = connection.cursor()
    cursor.execute("SELECT sentiment FROM portal_stock WHERE show_id = \'" + str(port_id) + "' LIMIT 1")
    for new_score_b in dictfetchall(cursor):
      sentiment_avg.append(float(new_score_b['sentiment']))
    rtn_avg = np.average(sentiment_avg)
    return JsonResponse({'score':str(rtn_avg)})

@login_required
@csrf_exempt
def get_portfolio_news(request, port_id):
    cursor = connection.cursor()
    cursor.execute("SELECT company_name FROM portal_stock WHERE show_id = \'" + str(port_id) + "' LIMIT 3")
    for d_score_b in dictfetchall(cursor):
      try:
        print(str(d_score_b['company_name']))
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=5e4b878121fc4daf91d5c3625e34a51a&sort=newest&q=" + str(d_score['company_name'])
        news = requests.get(url)
        rtnjson = news.json()
        return JsonResponse({'news':rtnjson}) 
      except:
        return JsonResponse({'news':"none"}) 


@csrf_exempt
def stock_sentiment_graph(request, stock_name):
  returnObj = {}
  results = {}
  quote = {}
  a = []
  limit = []
  with open("sentiment.csv") as f:
      reader = csv.reader(f)
      for row in reader:
        if str(row[1])[0:5] in '2016-11':
          if str(row[0]) in str(stock_name):
            if len(limit) == 0:
              limit.append(datetime.datetime.strptime(str(row[1][0:10]), '%Y-%m-%d').date())
              limit[0] = datetime.datetime.strptime(str(row[1][0:10]), '%Y-%m-%d').date()
              a.append({'date':str(row[1]),'High':str(row[2]),'Low':str(row[2])})
              print(datetime.datetime.strptime(str(row[1][0:10]), '%Y-%m-%d').date())
            if datetime.datetime.strptime(str(row[1][0:10]), '%Y-%m-%d').date() < limit[0]:
              limit[0] = datetime.datetime.strptime(str(row[1][0:10]), '%Y-%m-%d').date()
              a.append({'date':str(row[1]),'High':str(row[2]),'Low':str(row[2])})
              print(datetime.datetime.strptime(str(row[1][0:10]), '%Y-%m-%d').date())
  quote['quote'] = a
  results['results'] = quote
  return JsonResponse({'query':results}) 

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
    cursor.execute("select ticker, company_name from portal_stock where show_id = '" + str(xid) + "' LIMIT 3")  
    for dist_ticker in dictfetchall(cursor):
      url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=5e4b878121fc4daf91d5c3625e34a51a&sort=newest&q=" + str(dist_ticker['company_name'])
       # curl --head https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=1cf6ae6247764c28824a8f160cf73c75 2>/dev/null | grep -i "X-RateLimit"
      news = requests.get(url)
      try:
        newsarr.append(news.json())
      except:
        print(news)
  shuffle(newsarr)
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
def portfolio_sentiment_data(request, portfolio_id):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
  cursor = connection.cursor()
  cursor.execute("select ticker,allocation from portal_stock where show_id = '" + str(portfolio_id) + "'")  
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="data.csv"'
  writer = csv.writer(response)
  writer.writerow(['ticker', 'date', 'article_sentiment', 'impact_score','allocation'])
  stockarr = []
  for stock in dictfetchall(cursor):
    stockarr.append(str(stock['ticker']))
    sentimentarr = []
    impactarr = []
    date = ""
    with open("sentiment.csv") as f:
          reader = csv.reader(f)
          for row in reader:
              if len(sentimentarr) < 50:
                if str(row[0]) in str(stock['ticker']):
                  sentimentarr.append(float(row[2]))
                  try:
                    impactarr.append(float(row[3]))
                  except:
                    print("?")
                  date = str(row[1])
    impact_value = (((np.average(impactarr))*100)+50)
    sentiment_value = (((np.average(sentimentarr))*100)+50)
    writer.writerow([str(stock['ticker']),date,sentiment_value,impact_value,str(stock['allocation'])])
    # print(stock['allocation'])
  return response

    
