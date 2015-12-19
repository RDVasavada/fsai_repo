from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def portfolio(request):
	return render(request, 'user/portfolio_view.html')

def portfolio_settings(request):
    return render(request, 'user/portfolio_settings.html')

def portfolio_optimize(request):
    return render(request, 'user/portfolio_optimize.html')