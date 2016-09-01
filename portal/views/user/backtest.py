from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import urllib2
import requests
import json
from bs4 import BeautifulSoup
from urllib2 import urlopen
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from portal.views.user import top_portfolios

@csrf_exempt
@login_required
def backtest(request):
    portfolio_name = request.GET["portName"]
    url = "https://www.portfoliovisualizer.com/backtest-portfolio"      
    soup = BeautifulSoup(urlopen(url))
    link = soup.link
    nextL = link.find_next("link")
    nextL['href'] = "/static/css2/backtest.css"
    script = soup.script
    script = script.find_next("script")
    script = script.find_next("script")
    script = script.find_next("script")
    script = script.find_next("script")
    script = script.find_next("script")
    script = script.find_next("script")
    nScripts = script.find_next("script")
    nScripts['src'] = "/static/assets/js/backtest.js"
    form = soup.form
    form['action'] = "https://www.portfoliovisualizer.com/backtest-portfolio#analysisResults"
    form['target'] = "_blank"
    print(nScripts)
    print(nextL)
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
        portfolio_results = Portfolio.objects.filter(name__icontains=portfolio_name).filter(user__id=27)
        for port in portfolio_results:
            thisport = port.stock_set.all()
            portStocks = []
            i=1
            for stock in thisport:
                symbol = "symbol" + str(i)
                i+=1
                sim = soup.find('input',id=symbol)
                sim['value'] = stock.ticker
                portStocks.append(stock.ticker)
            percentStock = (100.00 / len(portStocks))
            i=1
            for stock in thisport:
                allocation = "allocation" + str(i) + "_1"
                print(allocation)
                alloc = soup.find('input',id=allocation)
                alloc['value'] = percentStock
                i+=1
                # print(symbol)
            stockLength = []
            for stock in thisport:
                stockLength.append("a")
            extras = []
            # testing purposes
            # extras.append({'symbol':'symbol16','number':'16','ticker':'AAPL','percentStock':'5%'})
            # extras.append({'symbol':'symbol17','number':'17','ticker':'AAPL','percentStock':'5%'})
            # extras.append({'symbol':'symbol18','number':'18','ticker':'AAPL','percentStock':'5%'})
            # extras.append({'symbol':'symbol19','number':'19','ticker':'AAPL','percentStock':'5%'})
            # extras.append({'symbol':'symbol20','number':'20','ticker':'AAPL','percentStock':'5%'})
            # extras.append({'symbol':'symbol21','number':'21','ticker':'AAPL','percentStock':'5%'})
            if len(stockLength) > 15:
                extra = len(stockLength) - 15
                pin_tag = soup.topBorder
                extras = []
                for x in range(0,extra):
                    sym = "symbol" + str(x)
                    new_tag = {'symbol':sym, 'number':str(x), 'percentStock':percentStock, 'ticker':portStocks[15+int(x)]}
                    extras.append(new_tag)
                    new_tag = soup.new_tag("div", class="", value="")
                    new_tag.insert_before(pin_tag)
                # print(allocation)
    # print(soup.prettify().encode('ascii', 'ignore'))    # pageReturn = str(soup)
    # print(pageReturn)
    try:
        print(extras)
        return JsonResponse({'data': soup.prettify().encode('ascii', 'ignore'), 'extras':extras })
    except UnboundLocalError:
        return JsonResponse({'data': soup.prettify().encode('ascii', 'ignore') })
