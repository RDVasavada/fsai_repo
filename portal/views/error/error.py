from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext


def error404(request):
  return render(request,'404.html')



def handler_403(request):
	return render(request, '403.html')


def handler_500(request):
	return render(request, '404.html')
