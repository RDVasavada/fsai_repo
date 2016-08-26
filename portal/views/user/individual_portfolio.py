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
def individual_portfolio(request):
    print(request.GET["q"])
    context_dict = {}
    if request.user.is_authenticated():
            username = request.user.username
            print("Authenticated User is :" + username)
            portalUser = PortalUser.objects.get(username=username)
            print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))
            print("getting all the portfolios")
            try:
                all_portfolios = Portfolio.objects.filter(user__id=portalUser.id)
                # all_portfolios = Portfolio.objects.filter(user__id=)
                for port in all_portfolios:
                    if (str(port.name) == request.GET["q"]):
                        portName = port.name
                        context_dict["portname"] = portName
                        portId = port.id
                        t_portfolios = top_portfolios(request, portId)
                        context_dict["portfolios"] = t_portfolios
                        thisport = port.stock_set.all()
                        context_dict['thisport'] = thisport
            except Exception as e:
                print(e)
                all_portfolios = None
    else:
        print("authentication is not successful")
    # context_dict["thisport"] = thisport
    context_dict["username"] = username
    # portfolios = top_portfolios(request, portId)
    # context_dict["portfolios"] = t_portfolios

    t = loader.get_template('user/individual_portfolio.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    #print(html)
    return HttpResponse(html)                    
    # html = get_top_portfolios(request, 'user/individual_portfolio.html')
    # return HttpResponse(html)



