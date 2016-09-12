from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from portal.views.user import get_top_portfolios

@csrf_exempt
def portfolio_settings(request):
    html = get_top_portfolios(request, 'user/portfolio_settings.html')
    return HttpResponse(html)
