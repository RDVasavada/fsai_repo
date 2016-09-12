from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from portal.models.data.sms import Sms
from portal.views.user import get_top_portfolios
from django.template import RequestContext, Context, loader
from django.db import connection
from django.http import JsonResponse
import json
from portal.models.user.portal_user import PortalUser

@csrf_exempt
def getsms(request):
  cursor = connection.cursor()
  cursor.execute("select * from portal_sms")        
  texts = dictfetchall(cursor)
  response_data = {}
  response_data['texts'] = texts
  return JsonResponse({'texts':texts})

@csrf_exempt
def sms(request):
  user_id = 1
  phone_number = request.POST.get('From', '')
  message = request.POST.get('Body', '')
  cursor = connection.cursor()
  cursor.execute("INSERT INTO `portal_sms` (date_created, phone_number, user_id, message, analysis, resolution) VALUES ('2016-07-09 12:11:25',"+str(phone_number)+",'1',"+str(message)+", 'Unresolved','Unresolved')")
  twiml = '<Response><Message>Saved message to DB!</Message></Response>'
  return HttpResponse(twiml, content_type='text/xml')

@csrf_exempt
def chat_portal(request):
    context_dict = {}
    if request.user.is_authenticated():
            username = request.user.username
            print("Authenticated User is :" + username)
            portalUser = PortalUser.objects.get(username=username)
            print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))
            print("getting all the portfolios")
            try:
                cursor = connection.cursor()
                cursor.execute("select * from portal_sms")        
                texts = dictfetchall(cursor)
                print(texts)
                context_dict["texts"] = texts
                print(texts)
            except Exception as e:
                print(e)
    else:
        print("authentication is not successful")
    context_dict["username"] = username
    t = loader.get_template('public/chat_portal.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    return HttpResponse(html)                    
                
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    