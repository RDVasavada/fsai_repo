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


'''
This method will save the portfolio object into database
'''
@csrf_exempt
def save_portfolio(request):
    print("inside save portfolio method")
    print("Request Method :" + request.method)
    #print(request.POST)
    name = request.POST['name']
    description = request.POST['description']
    risk = int(request.POST['risk'])
    timeframe = request.POST['timeframe']
    control_market = request.POST['control_market']
    investment = float(request.POST['investment'])

    user_id = request.POST['user']

    print("portfolio input in the request")
    print(name + "|" + description + "|" + str(risk) + "|" + timeframe + "|" +
          control_market + "|" + str(investment) + "|" + user_id)
    portalUser = PortalUser.objects.get(id=user_id);

    print("Portal User :")
    print(portalUser)

    new_portfolio = Portfolio(name, description, risk, timeframe,
                              control_market, investment, portalUser)

    #print("-------------------------------------")
    #print("after creating the new portfolio user")

    try:
        print("before object save method")
        print(new_portfolio)
        new_portfolio.save()
        print("after saving portfolio object")
    except Exception as e:
        print(e)

    #print("inside save portfolio method")

    '''
    portfolio_Objects = Portfolio.objects.all()
    t = loader.get_template('user/portfolio_view.html')
    c = Context(portfolio_Objects)
    html = t.render(c)
    '''

    context_dict = {}
    context_dict["portfolios"] = top_portfolios(user_id)
    t = loader.get_template('user/portfolio_view.html')
    c = Context(context_dict)

    html = t.render(c)
    return HttpResponse(html)
    #return render(request, 'user/portfolio_view.html')

'''
search for portfolios by the name
'''


def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


