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
def my_portfolios(request):
    print("inside portfolios of user")
    if request.user.is_authenticated():
        username = request.user.username
        print("Authenticated User is :" + username)
        portalUser = PortalUser.objects.get(username=username)
        # Get User information from username
        # get the portfolios of the user
        print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))

        print("getting all the portfolios")
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

    t = loader.get_template('user/my_portfolios.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    #print(html)
    return HttpResponse(html)
