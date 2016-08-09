from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.portfolio import get_top_portfolios

@login_required
def dashboard(request):
	html = get_top_portfolios(request, 'user/dashboard.html')
	return HttpResponse(html)
