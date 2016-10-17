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

def get_top_portfolios(request, html_template):
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
        print portalUser.id

    portfolios = top_portfolios(request, portalUser.id)
    # portfolios = top_portfolios(request, portalUser.id)
    # print portfolios

    context_dict = {}
    context_dict["portfolios"] = portfolios
    context_dict["username"] = username
    t = loader.get_template(html_template)
    c = Context(context_dict)
    html = t.render(context_dict)
    return html

@login_required
def top_portfolios(request, user_id):
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
    portfolios = {}
    print(user_id)
    try:
        #all_portfolios = Portfolio.objects.raw("select p.id as id,risk,"
        #                                       "timeframe,investment,control_market,name,sum(investment) as value "
        #                                       "from portal_portfolio p, portal_stock s "
        #                                       "where p.id=s.show_id and p.user_id=1 group by p.id order by investment desc limit 3")
        #print(user_id)
        cursor = connection.cursor()
        # cursor.execute("select p.id as id,name,risk,investment,sum(investment) as value, COUNT(DISTINCT(ticker)) as total_value from "
        #                "portal_portfolio p, portal_stock s where p.id=s.show_id "
        #                "and p.user_id=" + str(1) + " group by p.id order by investment desc limit 10")
        cursor.execute("select p.id as id,name,risk,investment, sum(investment) as value, COUNT(DISTINCT(ticker)) as no_of_tickers, "
                       "COUNT(DISTINCT(ticker)) as total_value from "
                       "portal_portfolio p, portal_stock s where p.id=s.show_id "
                       "and p.user_id=" + str(user_id) + " group by p.id order by investment desc limit 10") 
        # investment = cursor[]
        portfolios = dictfetchall(cursor)
        for port in portfolios:
            port['investment'] = '{:20,.2f}'.format(port['investment'])
        print(portfolios)
    except Exception as e:
        print(e)
    #Stock.objects.filter(show__user_id=1)
    #cursor = connection.cursor()
    #cursor.execute("UPDATE bar SET foo = 1 WHERE baz = %s", 67)
    #cursor.execute("SELECT foo FROM bar WHERE baz = %s", 12)
    return portfolios

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

