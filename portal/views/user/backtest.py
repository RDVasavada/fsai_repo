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
from stock import get_stocks_by_portfolio
from django.http import HttpResponseRedirect
from datetime import datetime
# from prophet import Prophet
# from prophet.data import YahooCloseData
# from prophet.analyze import default_analyzers
# from prophet.orders import Orders

class OrderGenerator(object):
    def run(self, prices, timestamp, cash, **kwargs):
        symbol = "AAPL"
        orders = Orders()
        if (prices.loc[timestamp, symbol] * 100) < cash:
            orders.add_order(symbol, 100)
        return orders

@csrf_exempt
@login_required
def backtest(request, port_id):
    if request.user.is_authenticated():
        username = request.user.username
        userid = request.user.id
        stocks = get_stocks_by_portfolio(request, port_id)
        even = (float(1.00/(len(stocks)-1))*100)
        url = "https://www.portfoliovisualizer.com/backtest-portfolio?s=y&timePeriod=4&startYear=2006&firstMonth=1&endYear=2016&lastMonth=12&endDate=10%2F28%2F2016&initialAmount=10000&annualOperation=0&annualAdjustment=0&inflationAdjusted=true&annualPercentage=0.0&frequency=4&rebalanceType=1&showYield=false&reinvestDividends=true"
        total = 00.00
        for x in range(0,len(stocks)):
	    print(stocks[x]['allocation'])
            total += float(str(stocks[x]['allocation'])[0:4])
        if total > 100.00:
            extra = total - 100.00
        else:
            extra = 100.00 - total
        print(total)
        print(extra)
        print("-_")
        x_bool = int(0)
        for x in range(len(stocks)):
            rtnstr = "&symbol"
            rtnstr += str(x+1)
            rtnstr += "="
            rtnstr += str(stocks[x]['ticker'])
            rtnstr += "&allocation"
            rtnstr += str(x+1)
            rtnstr += "_1="
            if extra > 2:
                if x_bool == int(0):
                    print("first run")
                    x_bool = int(1)
                    rtnstr += str(float(stocks[x]['allocation']) + extra -.01)
                else:
                    rtnstr += str(stocks[x]['allocation'])
            else:
                rtnstr += str(stocks[x]['allocation'])
            url+= rtnstr
        return HttpResponseRedirect(url)

