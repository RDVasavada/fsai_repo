from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext


def handler404(request):
    response = render_to_response('404.html', {},
    context_instance=RequestContext(request))
    response.status_code = 404
    return response



def handle_403(request):
	return render(request, '403.html')


def handle_500(request):
	return render(request, '404.html')
