from django.http import HttpResponse
from django.http import JsonResponse
import urllib2
import requests
import json
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from portal.models.data.stock import Stock


def sms_portcheck(id, q):
    all_portfolios = Portfolio.objects.filter(user__id=1)
    portIds = []
    if q == 'all':
        for port in all_portfolios:
            portIds.append(port.id)
    else:
        for port in all_portfolios:
            if port.name == str(q):
                portIds.append(port.id)
    total = 0
    change = 0
    for pid in portIds:
        all_stocks = Stock.objects.filter(show_id=str(pid))
        for stock in all_stocks:
            total += stock.initial_price
            change += stock.current_price
        diff = change - total
        print(str.format('{0:.3f}', diff/total))
    if q == 'all':
        rtnstring = "You initially invested " + str(total) + "$ into your portfolios. Since then it has " + str.format('{0:.3f}', diff/total) + "% unrealized changes and is now worth " + str(change) + "$."
    else:
        rtnstring = "You initially invested " + str(total) + "$ into " + str(q) + ". Since then it has " + str.format('{0:.3f}', diff/total) + "% unrealized changes and is now worth " + str(change) + "$."
    print(rtnstring)
    returnString = str(rtnstring)
    return returnString
    