from django.http import HttpResponse
from portal.views.user.top_portfolios import top_portfolios
from portal.views.user.top_portfolios import get_top_portfolios
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
from django.template import RequestContext, Context, loader
import json
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from portal.models.data.stock import Stock
from portal.views.user import get_top_portfolios

@login_required
@csrf_exempt
def support(request): 
  context_dict = {}
  if request.user.is_authenticated():
      username = request.user.username
      portalUser = PortalUser.objects.get(username=username)
      portfolios = top_portfolios(request,portalUser.id)
      picture_url = portalUser.picture_url
      context_dict['email'] = portalUser.email
      context_dict['date_joined'] = portalUser.date_joined
      context_dict['phone'] = portalUser.phone
      context_dict['confirm_email'] = portalUser.confirm_email
      context_dict['confirm_phone'] = portalUser.confirm_phone
      # context_dict['first_name'] = portalUser.username
      context_dict['last'] = portalUser.last_login
      context_dict['last_name'] = portalUser.last_name
      context_dict['first_name'] = portalUser.first_name
      context_dict['firmname'] = portalUser.firmname
      context_dict['firmsize'] = portalUser.firmsize
      context_dict['assets'] = portalUser.assets
  t = loader.get_template("user/support.html")
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    