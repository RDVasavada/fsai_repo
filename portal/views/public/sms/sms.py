from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from portal.models.data.sms import Sms
from portal.views.user import get_top_portfolios
from django.template import RequestContext, Context, loader
from django.db import connection
from django.http import JsonResponse
import json
import requests
import re
from portal.models.user.portal_user import PortalUser
from portal.views.public.sms import sms_symbolexchange
from portal.views.public.sms import sms_portcheck
from portal.views.public.sms import sms_backtest
from portal.views.public.sms import sms_company

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
  number = request.POST.get('From', '')
  phone_number = number[2:]
  # phone_number = 9492459949
  cursor = connection.cursor()
  cursor.execute("select * from portal_portaluser where '" + str(phone_number) + "' = phone ")
  user = dictfetchall(cursor)
  user_id = user[0]['id']
  message = request.POST.get('Body', '')
  # message = "how are my portfolios doing"
  # message = "who is the ceo of alphabet?"
  rtnstring = analyze(message, user_id)
  # status = sms_company.sms_company(1,'Amazon')
  # print(status)
  # company_name = "ABM"
  # company_name = sms_symbolexchange.sms_symbolexchange(message)
  # response = requests.get("http://chstocksearch.herokuapp.com/api/"+str(message))
  # symbol= response.json()[0]['company']
  # symbol = "AAPL"
  cursor.execute("INSERT INTO `portal_sms` (date_created, phone_number, user_id, message, analysis, resolution) VALUES"
                 "('2016-07-09 12:11:25'," + str(phone_number) + "," + str(user_id) +  ",'" + str(message) + "', 'Unresolved','Unresolved')")
  twiml = '<Response><Message>' + str(rtnstring) + '</Message></Response>'
  return HttpResponse(twiml, content_type='text/xml')

def analyze(message, user_id):
  if "my portfolios" in message:
    return sms_portcheck.sms_portcheck(user_id, 'all')
  if "what" in message:
    if "buy" in message:
      s = re.search("buy (.*) for", message)
      return sms_company.sms_company(user_id, str(s.groups()))
    if "ceo of" in message:
      s = re.search("ceo of (.*)", message)
      s = s.groups()
      s = str(s)
      s = re.sub(r'[^\w\s]','',s)
      return sms_company.sms_ceo(s)
    if "ceo for" in message:
      s = re.search("ceo for (.*)", message)
      s = s.groups()
      s = str(s)
      s = re.sub(r'[^\w\s]','',s)
      return sms_company.sms_ceo(s)
  if "who" in message:
    if "ceo of" in message:
      s = re.search("ceo of (.*)", message)
      s = s.groups()
      s = str(s)
      s = re.sub(r'[^\w\s]','',s)
      return sms_company.sms_ceo(s)
    if "ceo for" in message:
      s = re.search("ceo for (.*)", message)
      s = s.groups()
      s = str(s)
      s = re.sub(r'[^\w\s]','',s)    

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