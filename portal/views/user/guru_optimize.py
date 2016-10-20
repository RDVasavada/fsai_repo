from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import get_top_portfolios
from django.middleware.csrf import rotate_token
import requests

@login_required
def guru_optimize(request):
  # print(request.POST['key-pe'])
  html = get_top_portfolios(request, 'user/guru_optimize.html')
  return HttpResponse(html)
