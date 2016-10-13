from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import *
from django.db import connection
from portal.models.user.portal_user import PortalUser
from django.template import RequestContext, Context, loader

@login_required
def news_portal(request):
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id
    portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(request, portalUser.id)
  # cursor = connection.cursor()
  # cursor.execute("SELECT id FROM `portal_portfolio` WHERE "
  #               "'" + str(userid) + "' = user_id")
  # for item in dictfetchall(curosor):
  #   cursor.execute("SELECT ticker FROM `portal_stock`  WHERE "
  #                 "'" + str(item['id']) + "' = show_id ")
    
  html = get_top_portfolios(request, 'user/news_portal.html')
  return HttpResponse(html)

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]