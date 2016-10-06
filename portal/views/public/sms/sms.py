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
from portal.views.public.sms import sms_portcheck, sms_company

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
  cursor = connection.cursor()
  cursor.execute("select * from portal_portaluser where '" + str(phone_number) + "' = phone ")
  user = dictfetchall(cursor)
  user_id = user[0]['id']
  message = request.POST.get('Body', '')
  rtnstring = analyze(message)
  cursor.execute("INSERT INTO `portal_sms` (date_created, phone_number, user_id, message, analysis, resolution) VALUES"
                 "('2016-07-09 12:11:25'," + str(phone_number) + "," + str(user_id) +  ",'" + str(message) + "', '" + str(rtnstring) + "', 'Unresolved')")
  twiml = '<Response><Message>' + str(rtnstring) + '</Message></Response>'
  return HttpResponse(twiml, content_type='text/xml')

def analyze(message):
  message = message.lower()
  if "can you do" in message:
    return("I can carry out basic commands for you via SMS, or chat. Text me! Some things I can do: provide updates on your portfolios, provide information about stocks, and companies.")
  if "my portfolios" in message:
    if "sp500" in message or "s&p" in message:
      return("compare s&p to my port")
    elif "nasdaq" in message or "ndx" in message:
      return("compare ndx to my port")
    elif "dow" in message or "dji" in message or "dow jones" in message:
      return("compare dji to my port")
    else:
      return("Your portfolios are doing well!")
  if "compare" in message:
    if "s&p500" in message or "s&p" in message:
      if (hasPortfolio(message)):
        return("Your portfolio " + hasPortfolio(message) + " compares well")      
      else:
        try:
          return("compare " + findCompany(message)[0] + " to my the s&p")
        except IndexError:
          return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
    elif "nasdaq" in message or "ndx" in message:
      if (hasPortfolio(message)):
        return("your portfolio " + hasPortfolio(message) + " compares well")      
      else:     
        try:
          return("compare " + findCompany(message)[0] + " to my the ndx")
        except IndexError:
          return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
    elif "dow" in message or "dji" in message or "dow jones" in message:
      if (hasPortfolio(message)):
        return("your portfolio " + hasPortfolio(message) + " compares well")      
      else:     
        try:
          return("compare " + findCompany(message)[0] + " to my the dji")
        except IndexError:
          return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
    else:
      return("get status of ports")
  elif "buy" in message and "for" in message:
    try:
      return("you bought " + findCompany(message)[0] + " for 3$")
    except IndexError:
      return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "top" in message or "highest performing" in message:
    return("the top stocks today are my d !")
  elif "lowest" in message or "worst" in message: 
    return("the lowest stocks today are my d !")
  elif "how" in message and "performing" in message:
    if (hasPortfolio(message)):
      return("your portfolio " + hasPortfolio(message) + " is doing well!")
    elif (findCompany(message)):
      try:
        return("your stock " + findCompany(message)[0] + " is doing quite well")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "how" in message and "doing" in message:
    if (hasPortfolio(message)):
      return("your portfolio " + hasPortfolio(message) + " is doing well!")
    elif (findCompany(message)):
      try:
        return("your stock " + findCompany(message)[0] + " is doing quite well")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")       
  elif "symbol for" in message or "symbol of" in message:
    if (findCompany(message)):
      return("the symbol for " + findCompany(message)[0] + " is google !")
  elif "company name of" in message or "company name for" in message or "what company is" in message:
    if (findCompany(message)):
      return("the company name for " + findCompany(message)[0] + " is google !")
  elif "ceo of" in message or "ceo for" in message:
    if (findCompany(message)):
      return("the ceo of " + findCompany(message)[0] + " is tim cook !")
  elif "dividends" in message and "does" in message:
    if (findCompany(message)):
      return("the company " + findCompany(message)[0] + " does pay dividends!")
  elif "what" in message and "price" in message:
    if (findCompany(message)):
      return("the market price for the company " + findCompany(message)[0] + " is 2!")
  elif "gain" in message:
    if hasPortfolio(message):
      return("your gains for " + hasPortfolio(message) + " is 3$!")
    elif findCompany(message):
      try:
        return("your gains for " +  findCompany(message)[0] + " is 3$")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "losses" in message:
    if hasPortfolio(message):
      return("your losses for " + hasPortfolio(message) + " is 3$!")
    elif findCompany(message):
      try:
        return("your losses for " +  findCompany(message)[0] + " is 3$")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "rating" in message:
    if (findCompany(message)):
      return("the rating for the company " + findCompany(message)[0] + " by analysts are high!")
  elif "pe ratio" in message:
    if (findCompany(message)):
      return("the PE ratio for the company " + findCompany(message)[0] + " by analysts are high!")
  elif "beta" in message:
    if (findCompany(message)):
      return("the beta for the company " + findCompany(message)[0] + " by analysts are high!")
  else:
    return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")

def hasNumber(string):
  return any(char.isdigit() for char in string)  

def hasPortfolio(str):
  if request.user.is_authenticated():
      username = request.user.username
      portalUser = PortalUser.objects.get(username=username)
      try:
          all_portfolios = Portfolio.objects.filter(user__id=1)
          for port in all_portfolios:
            if port in str:
              return port
      except IndexError:
        return('err')

def findCompany(str):
  string = str.lower()
  string = re.sub(r'[^\w\s]','',string)
  string = ''.join([i for i in string if not i.isdigit()])  
  string = string.split()
  bank = ['?','my','how','are','you','see','can','i','whatsup','with','did','anything','is','there','should','know','to','the','what','much','will','profit','be','future','projected','budget','backtest','portfolio','unrealized','gains','buy','perform','performing','top','today','stock','stocks','about','a','into','for','who','whats','share','of','in','ceo','store','analyst','revenue','volume','day','hi','doing',"what's",'symbol','losses','dividend','company','name','ndx','dji','dow jones','nasdaq','sp','sp500','market','rating','analyst','analyze','revenue','year','compare','does','in','price','against','margin']
  for word in bank:
    try:
      string.remove(word)
    except ValueError:
      continue
  return(string)

@csrf_exempt
def chat_portal(request):
    context_dict = {}
    if request.user.is_authenticated():
      username = request.user.username
      print("Authenticated User is :" + username)
      portalUser = PortalUser.objects.get(username=username)
      print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))
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
