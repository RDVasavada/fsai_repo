from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import *

@login_required
def news_portal(request):
  html = get_top_portfolios(request, 'user/news_portal.html')
  return HttpResponse(html)
