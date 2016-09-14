from django.http import HttpResponse
from django.http import JsonResponse
import urllib2
import requests
import json
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser


def sms_company(id, q):
    # all_portfolios = Portfolio.objects.filter(user__id=1)
    # print(all_portfolios)
    # for port in all_portfolios:
    #     portName = port.name
    #     print(portName)
    company_name = "sms_company"
    returnString = str(company_name)
    return returnString
    