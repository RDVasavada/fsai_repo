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
from portal.views.user import top_portfolios

@login_required
def search_portfolio(request):
    print("search for portfolios")
    if request.user.is_authenticated():
        username = request.user.username
        print("Authenticated User is :" + username)
        portalUser = PortalUser.objects.get(username=username)
        portfolio_name = request.GET["query"]
        portfolio_results = Portfolio.objects.filter(string__icontains=portfolio_name).filter(user__id=portalUser.id)
        print("Portfolio Results ")
        print(portfolio_results)

        context_dict = {}
        context_dict["all_portfolios"] = portfolio_results

        t_portfolios = top_portfolios(portalUser.id)
        context_dict["portfolios"] = t_portfolios

        t = loader.get_template('user/my_portfolios.html')
        c = Context(context_dict)
        html = t.render(c)
        # print(html)
        return HttpResponse(html)
    return HttpResponse("this returns the search results")