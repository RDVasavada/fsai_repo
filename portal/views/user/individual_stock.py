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
from portal.views.user.top_portfolios import *


@csrf_exempt
@login_required
def individual_stock(request):
    context_dict = {}
    context_dict["company_symbol"] = request.POST["company_name"]
    # print(request.POST["company_name"])
    response = requests.get("http://chstocksearch.herokuapp.com/api/"+request.POST['company_name'])
    print(response.json())
    try:
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1cf6ae6247764c28824a8f160cf73c75&sort=newest&q=" + str(response.json()[0]['company']) + " stock"
    except IndexError:
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1cf6ae6247764c28824a8f160cf73c75&sort=newest&q=" + str(request.POST["company_name"]) + " stock"
    print(url)
    news = requests.get(url)
    print(news.json()['response'])
    context_dict["newsheadline"] = news.json()['response']['docs']
    try:
        context_dict["company_name"] = response.json()[0]['company']
    except IndexError:
        context_dict["company_name"] = response.json()
    try: 
        params_gd = OrderedDict({
            "v": "1",
            "format": "json",
            "t.p": "83856",
            "t.k": "cbW9p5pFQDw",
            "action": "employers",
            "q": response.json()[0]['company'],
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
            "q": request.POST["company_name"],
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
        company_stats = jsonResponse['response']['employers'][0]
    except IndexError:
        print(jsonResponse)
        company_stats = {'industryName': 'Unavailable','workLifeBalanceRating':'--','ceo':{'name':'Unavailable','pctApprove':'--'}}
    # print(company_stats['employers'][0])
    #     numStocks = jsonResponse['numStocks']
    # company_stats = jsonResponseresponse_gd.content
    # print(company_stats[0])
    context_dict["company_stats"] = company_stats
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(request, portalUser.id)
    context_dict["portfolios"] = portfolios
    context_dict["username"] = username    
    t = loader.get_template('user/individual_stock.html')
    c = Context(context_dict)
    html = t.render(c)
    return HttpResponse(html)
