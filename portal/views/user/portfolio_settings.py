from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from portal.views.user import get_top_portfolios
from django.http import JsonResponse
import csv
from django.db import connection


@csrf_exempt
def portfolio_exist(request, portname):
    portname = str(portname)[:-1]
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM portal_portfolio WHERE name = \'" + str(portname) + "\'")
    nameL = 0
    print(str(portname))
    for item in dictfetchall(cursor):
        nameL += 1
    if nameL == 0 : 
        return(JsonResponse({'exist':0}))
    else:
        return(JsonResponse({'exist':1}))

@csrf_exempt
def phone_exist(request, portname):
    portname = str(portname)[:-1]
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM portal_portfolio WHERE name = \'" + str(portname) + "\'")
    nameL = 0
    print(str(portname))
    for item in dictfetchall(cursor):
        nameL += 1
    if nameL == 0 : 
        return(JsonResponse({'exist':0}))
    else:
        return(JsonResponse({'exist':1}))



@csrf_exempt
def portfolio_settings(request):
    html = get_top_portfolios(request, 'user/portfolio_settings.html')
    return HttpResponse(html)

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    
