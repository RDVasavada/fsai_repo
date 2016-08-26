from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import urllib2
import requests
import json
# from bs4 import BeautifulSoup
from urllib2 import urlopen
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from portal.views.user import top_portfolios

@csrf_exempt
@login_required
def backtest(request):
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
        portfolio_name = request.GET["portfolio"]
        portfolio_results = Portfolio.objects.filter(name__icontains=portfolio_name).filter(user__id=1)
        for port in portfolio_results:
            thisport = port.stock_set.all()
            for stock in thisport:
                print(stock.ticker)      
    # url = "https://www.portfoliovisualizer.com/backtest-portfolio"      
    # soup = BeautifulSoup(urlopen(url))
    # pageReturn = str(soup)
    # print(pageReturn)
    return JsonResponse("asdf")