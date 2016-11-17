from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
import json
from django.db import connection
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from urllib2 import urlopen
from django.db import connection
import csv
from portal.models.data.stock import Stock
from portal.views.user.top_portfolios import *


@csrf_exempt
@login_required
def individual_stock(request, stock_name):
    context_dict = {}
    context_dict["company_symbol"] = str(stock_name)
    cursor = connection.cursor()
    cursor.execute("SELECT sentiment, current_price FROM portal_stock WHERE ticker = \'" + str(stock_name) + "' LIMIT 1")
    for s_score in dictfetchall(cursor):
         context_dict['score'] =  s_score['sentiment']
         context_dict['current_price'] =  s_score['current_price']
    url = "http://finance.yahoo.com/d/quotes.csv?s="+str(stock_name)+"&f=sn"
    response = urlopen(url)
    cr = csv.reader(response)
    for row in cr:
        CompanyName = row[1]
        context_dict['company_name'] = CompanyName
        CompanyName = CompanyName.split()
        CompanyName = CompanyName[0] + " " + CompanyName[1]
    try:
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1cf6ae6247764c28824a8f160cf73c75&sort=newest&q=" + str(CompanyName)
    except IndexError:
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1cf6ae6247764c28824a8f160cf73c75&sort=newest&q=" + str(stock_name) + " stock"
    try:
        news = requests.get(url)
        context_dict["newsheadline"] = news.json()['response']['docs']
    except:
        context_dict["newsheadline"] = ""

    try: 
        params_gd = OrderedDict({
            "v": "1",
            "format": "json",
            "t.p": "83856",
            "t.k": "cbW9p5pFQDw",
            "action": "employers",
            "q": CompanyName,
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
            "q": stock_name,
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
    try:   
        stats = requests.get("https://www.quandl.com/api/v3/datatables/SHARADAR/SF1.json?ticker=" + str(stock_name) + "&qopts.columns=ticker,ASSETTURNOVER,ASSETSAVG,BVPS,CURRENTRATIO,DE,DIVYIELD,EBITDA,EBITDAUSD,EBITDAMARGIN,EBT,EQUITYAVG,EV,EVEBIT,EVEBITDA,FCF,FCFPS,FXUSD,GROSSMARGIN,INVCAP,MARKETCAP,NETMARGIN,PE,PE1,PS1,PS,PB,ROIC,SPS,PAYOUTRATIO,ROA,ROE,ROS,TANGIBLES,TBVPS,WORKINGCAPITAL,ASSETS,ASSETSC,ASSETSNC,CASHNEQ,CASHNEQUSD,RECEIVABLES,INTANGIBLES,INVENTORY,LIABILITIES,LIABILITIESC,LIABILITIESNC,DEBT,DEBTUSD,DEBTC,DEBTNC,DEFERREDREV,DEPOSITS,INVESTMENTS,INVESTMENTSC,INVESTMENTSNC,PAYABLES,PPNENET,TAXASSETS,TAXLIABILITIES,EQUITY,EQUITYUSD,RETEARN,ACCOCI,NCFO,DEPAMOR,SBCOMP,NCFI,CAPEX,NCFBUS,NCFINV,NCFF,NCFDEBT,NCFCOMMON,NCFDIV,NCF,REVENUE,REVENUEUSD,COR,GP,RND,SGNA,OPEX,OPINC,EBIT,EBITUSD,INTEXP,TAXEXP,CONSOLINC,NETINCNCI,NETINC,PREFDIVIS,NETINCCMN,NETINCCMNUSD,NETINCDIS,EPS,EPSUSD,EPSDIL,SHARESWA,SHARESWADIL,DPS&calendardate.gte=2013-12-31&api_key=X8CjGKTPEqTuto2v_Q94")
        stats = stats.json()['datatable']['data'][len(stats.json()['datatable']['data'])-1]
        metrics = []
        balance = []
        cash = []
        income = []
        for x in range(0,36):
            metrics.append(stats[x])
        for x in range(36,(36+27)):
            balance.append(stats[x])
        for x in range((36+27),(36+28+12)):
            cash.append(stats[x])
        for x in range((36+28+12),(36+28+13+24)):
            income.append(stats[x])
        context_dict['metrics']=metrics
        context_dict['balance']=balance
        context_dict['cash']=cash
        context_dict['income']=income
    except:
        stats = []  
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
