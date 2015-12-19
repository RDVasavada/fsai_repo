from django.shortcuts import render

def handle_404(request):
	return render(request, '404.html')


def handle_403(request):
	return render(request, '403.html')


def handle_500(request):
	return render(request, '404.html')
