from django.http import HttpResponse
from django.http import JsonResponse
import urllib2
import requests
import json
import re
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from portal.models.data.stock import Stock
from collections import OrderedDict 

def sms_company(id, q):
    q = re.sub(r'[^\w\s]','',q)
    all_portfolios = Portfolio.objects.filter(user__id=1)
    company = ""
    for port in all_portfolios:
        portId = port.id
        all_stock = Stock.objects.filter(show_id=portId)
        for stock in all_stock:
            if stock.ticker == str(q).upper():
              change = stock.current_price - stock.initial_price
              change = change / stock.initial_price
              change = (str.format('{0:.3f}', change))
              company = "You originally bought " + str(stock.ticker) + " for " + str(stock.initial_price) + " on " + str(stock.buy_date) + ". It is now worth " + str(stock.current_price) + ", which means your unrealized changes are " + str(change) + "%. "
    if len(company) == 0:
      response = requests.get("http://chstocksearch.herokuapp.com/api/"+str(q))
      try:
        symbol = response.json()[0]['symbol']
      except IndexError:
        returnString = "I couldn't find that company!"
        return returnString
      print(symbol)
      for port in all_portfolios:
        portId = port.id
        all_stock = Stock.objects.filter(show_id=portId)
        for stock in all_stock:
          if stock.ticker == str(symbol):
              change = stock.current_price - stock.initial_price
              change = change / stock.initial_price
              change = (str.format('{0:.3f}', change))
              company = "You originally bought " + str(stock.ticker) + " for " + str(stock.initial_price) + " on " + str(stock.buy_date) + ". It is now worth " + str(stock.current_price) + ", which means your unrealized changes are " + str(change) + "%. "
    print(company)
    returnString = str(company)
    return returnString
    
def sms_ceo(company):
    try: 
        params_gd = OrderedDict({
            "v": "1",
            "format": "json",
            "t.p": "83856",
            "t.k": "cbW9p5pFQDw",
            "action": "employers",
            "q": str(company),
            # programmatically get the IP of the machine
            "userip": json.loads(urllib2.urlopen("http://ip.jsontest.com/").read().decode('utf-8'))['ip'],
            "useragent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"
        })
    except IndexError:
        params_gd = OrderedDict({
            "v": "1",
            "format": "json",
            "t.p": "83856",
            "t.k": "cbW9p5pFQDw",
            "action": "employers",
            "q": str(company),
            # programmatically get the IP of the machine
            "userip": json.loads(urllib2.urlopen("http://ip.jsontest.com/").read().decode('utf-8'))['ip'],
            "useragent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"
        })     
    basepath_gd = 'http://api.glassdoor.com/api/api.htm'
    response_gd = requests.get(basepath_gd,
                             params=params_gd,
                             headers={
                                 "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"
                             })
    jsonResponse = response_gd.json()
    try:
      ceo = str(jsonResponse['response']['employers'][0]['ceo']['name'])
    except IndexError:
      rtnstring = "Company Name not found!"
      return rtnstring
    rtnstring = "The CEO of " + str(company) + " is " + str(ceo) + "."
    return rtnstring