from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import get_top_portfolios, top_portfolios
from django.middleware.csrf import rotate_token
from django.db import connection
from portal.models.user.portal_user import PortalUser
import re
import requests
from portal.models.data.portfolio import Portfolio
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext, Context, loader
from yahoo_finance import Share

@csrf_exempt
@login_required
def inbox(request):
  rotate_token(request)
  context_dict = {}
  if request.user.is_authenticated():
    username = request.user.username
    portId = request.user.id
    portalUser = PortalUser.objects.get(username=username)
    picture_url = portalUser.picture_url
    context_dict['picture_url'] = picture_url
    try:
        arr = getconnections(request)
        # print(arr)
        context_dict['friends'] = arr
    except Exception as e:
      print(e)
  else:
    print("authentication is not successful")
  context_dict["username"] = username
  t = loader.get_template('user/inbox.html')
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)

@csrf_exempt
def getmsg(request):
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id
    fromid = request.GET['selected']
    print(fromid)
    cursor = connection.cursor()
    rtnarray = []
    cursor.execute("SELECT id, time FROM portal_messageheader WHERE "
                   "'" + fromid + "' = to_id AND '" + str(userid) + "' = from_id")
    msgs = dictfetchall(cursor)
    for msg in msgs:
      cursor.execute("SELECT content, id FROM portal_message WHERE "
                     "'" + str(msg['id']) + "' = header_id")
      returnmsg = dictfetchall(cursor)
      try:
        returnmsg[0]['time'] = str(msg['time'])
      except IndexError:
        print("none")   
      rtnarray.append(returnmsg)  
    cursor.execute("SELECT id, time FROM portal_messageheader WHERE "
                   "'" + str(fromid) + "' = from_id AND '" + str(userid) + "' = to_id")
    msgs = dictfetchall(cursor)
    for msg in msgs:
      cursor.execute("SELECT content, id FROM portal_message WHERE "
                     "'" + str(msg['id']) + "' = header_id")
      returnmsg = dictfetchall(cursor)
      try:
        returnmsg[0]['time'] = str(msg['time'])
      except IndexError:
        print("none")   
      rtnarray.append(returnmsg)
    sortArr=[]
    for msg in rtnarray:
      try:
        sortArr.append(msg[0]['id'])
      except IndexError:
        sortArr.append(msg)
    sortArr = sorted(sortArr)
    newArr=[]
    for msg in sortArr:
      if msg > 0:
        for x in rtnarray:
          try:
            if x[0]['id'] == msg:
              b = []
              b.append(x[0])
              newArr.append(b)
          except IndexError:
            if x == msg:
              b=[]
              b.append(x)
              newArr.append(b)                    
    return JsonResponse({'data':newArr})  


@csrf_exempt
def sendmsg(request):
  context_dict = {}
  if request.user.is_authenticated():
    username = request.user.username
    portId = request.user.id
    portalUser = PortalUser.objects.get(username=username)
    try:
        arr = getconnections(request)
        context_dict['friends'] = arr
    except Exception as e:
      print(e)
  else:
    print("authentication is not successful")
  context_dict["username"] = username
  message = str(request.POST['message'])
  message = "<" + username + "> : " + message
  # print(message)
  recipient = request.POST['to']
  a_time = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
  cursor = connection.cursor()
  cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES"
                 "('" + str(portId) + "','" + str(recipient) + "','unread','" + str(a_time) + "','friends');")
  cursor.execute("SELECT LAST_INSERT_ID();")
  header_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
  cursor.execute("INSERT INTO `portal_message` (header_id, is_from_sender, content) VALUES "
                 "('" + str(header_id) + "','" + str(portId) + "','" + str(message) + "');")
  if recipient == '0':
    botmsg = analyze(message, portId, username)
    cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES"
                     "('0','" + str(portId) + "','unread','" + str(a_time) + "','friends');")  
    cursor.execute("SELECT LAST_INSERT_ID();")
    header_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
    cursor.execute("INSERT INTO `portal_message` (header_id, is_from_sender, content) VALUES "
                 "('" + str(header_id) + "','0','" + str(botmsg) + "');")    
  t = loader.get_template('user/inbox.html')
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)   


@csrf_exempt
def getconnections(request):
  if request.user.is_authenticated():
    userid = request.user.id
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    picture_url = portalUser.picture_url
    arr = []
    arr.append({
      'username' : username,
      'id' : userid,
      'picture_url' : picture_url,
    })
    cursor = connection.cursor()
    cursor.execute("SELECT username, id, picture_url FROM portal_portaluser WHERE "
                    "1 = connections AND id != '" + str(userid) + "'")
    users = dictfetchall(cursor)
    for user in users:
        try:
          arr.append({
            'username' : user['username'],
            'id': user['id'],
            'picture_url': user['picture_url']
          })
        except IndexError:
          print(user)
  return JsonResponse({'data':arr})

@csrf_exempt
def addconnection(request):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    user_id = request.user.id
    cursor = connection.cursor()
    cursor.execute("UPDATE portal_portaluser SET connections "
                    " = 1 WHERE id = '" + str(user_id) + "'")
    return JsonResponse({'data':'added you'})

@csrf_exempt
def removeconnection(request):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    user_id = request.user.id
    cursor = connection.cursor()
    cursor.execute("UPDATE portal_portaluser SET connections "
                    " = 0 WHERE id = '" + str(user_id) + "'")
    return JsonResponse({'data':'removed you'})

@csrf_exempt
def delmsg(request):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    yours = portalUser.connections
    user_id = request.user.id  
  delid = request.POST['delid']
  print(delid)
  cursor = connection.cursor()
  cursor.execute("SELECT header_id FROM portal_message"
                  " WHERE id = '" + str(delid) + "'")
  msgheaders = dictfetchall(cursor)
  for msgid in msgheaders:
    cursor.execute("UPDATE `portal_messageheader` SET subject "
                  "= 'deleted' WHERE from_id = '" + str(user_id) + "' and id = '" + str(msgid['header_id']) + "'")
  connection.close()
  cursor.close()
  msg = "deleted"
  return JsonResponse({'data':msg})

@csrf_exempt
def delfriend(request):
  delid = request.POST['delid']
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id
    portalUser = PortalUser.objects.get(username=username)
    connections = portalUser.connections
    connections = connections.split(',')
    arr = []
    for person in connections:
      if str(person) != str(delid):
        arr.append(str(person))
    arr = ",".join(arr)
    cursor = connection.cursor()
    cursor.execute("UPDATE `portal_portaluser` SET connections "
                    " = '" + str(arr) + "' WHERE id = '" + str(userid) + "'" )
    cursor.execute("DELETE from `portal_messageheader` "
                  "WHERE from_id = '" + str(userid) + "' AND to_id = '" + str(delid) + "'")
    cursor.execute("DELETE from `portal_messageheader` "
                  "WHERE to_id = '" + str(userid) + "' AND from_id = '" + str(delid) + "'")
    connection.close()
  return JsonResponse({'data':'deleted'}) 

def searchuser(query):
  rtn = 0
  if "@" in str(query):
    rtn = byemail(query)
  else:
    rtn = byuser(query)
  if rtn != 0:
    return rtn
  else:
    return 0

def byuser(query):
  user = PortalUser.objects.filter(username=str(query))
  return PortalUser.objects.filter(username=str(query))

def byemail(query):
  user = PortalUser.objects.filter(email=str(query))
  return PortalUser.objects.filter(email=str(query))

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]
def analyze(message, id, username):
  message = message.lower()
  if "can you do" in message:
    return("<Hyperchat Bot> : I can carry out basic commands for you via SMS, or chat. Text me at (205)490 - 7304! Some things I can do: provide updates on your portfolios, provide information about stocks, and companies.")
  elif "what is this website" in message:
    return("<Hyperchat Bot> : Vise is an online robo-advisement platform for financial advisors.")
  elif "who are you" in message:
    return("<Hyperchat Bot> : Hello " + str(username) + ". My name is Vise and I was created to serve the masses.")
  elif "who created you" in message:
    return("<Hyperchat Bot> : My creator is Adam")
  elif "what are you" in message:
    return("<Hyperchat Bot> : A representation of binary code.")
  elif "my portfolios" in message:
    if "sp500" in message or "s&p" in message:
      cursor = connection.cursor()
      arr = []
      cursor.execute("SELECT created_date, investment, id, name FROM `portal_portfolio` WHERE "
                    "'" + str(id) + "' = user_id")
      for item in dictfetchall(cursor):
        total = 0
        cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                      "buy_date, sell_date, "
                      "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                      "as gain from portal_stock where show_id=" + str(item['id']))
        for value in dictfetchall(cursor):
          total = total + int(value['gain'])
        startdate = str(item['created_date'])[0:10]
        b_time = strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
        sp = Share('^GSPC').get_historical(startdate, today)
        gspreturn = float(sp[0]['Close']) - float(sp[len(sp)-1]['Close'])
        rtnstr = "Since " + str(startdate) + ", the S&P500 has changed " + str(gspreturn) + "$, while your portfolio " + str(item['name']) + " has changed " + str(total) + "$. "
        arr.append(rtnstr)
      rtn = ' '.join(arr)
      return("<Hyperchat Bot> : Your comparison summaries: " + rtn)
    elif "nasdaq" in message or "ndx" in message:
      cursor = connection.cursor()
      arr = []
      cursor.execute("SELECT created_date, investment, id, name FROM `portal_portfolio` WHERE "
                    "'" + str(id) + "' = user_id")
      for item in dictfetchall(cursor):
        total = 0
        cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                      "buy_date, sell_date, "
                      "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                      "as gain from portal_stock where show_id=" + str(item['id']))
        for value in dictfetchall(cursor):
          total = total + int(value['gain'])
        startdate = str(item['created_date'])[0:10]
        today = time.strftime("%Y-%m-%d")
        sp = Share('^IXIC').get_historical(startdate, today)
        gspreturn = float(sp[0]['Close']) - float(sp[len(sp)-1]['Close'])
        rtnstr = "Since " + str(startdate) + ", the NASDAQ has changed " + str(gspreturn) + "$, while your portfolio " + str(item['name']) + " has changed " + str(total) + "$. "
        arr.append(rtnstr)
      rtn = ' '.join(arr)
      return("<Hyperchat Bot> : Your comparison summaries: " + rtn)
    elif "dow" in message or "dji" in message or "dow jones" in message:
      return("compare dji to my port")
    else:
      cursor = connection.cursor()
      arr = []
      cursor.execute("SELECT investment, id, name FROM `portal_portfolio` WHERE "
                    "'" + str(id) + "' = user_id")
      for item in dictfetchall(cursor):
        total = 0
        cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                      "buy_date, sell_date, "
                      "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                      "as gain from portal_stock where show_id=" + str(item['id']))
        for value in dictfetchall(cursor):
          total = total + int(value['gain'])
          print(total)
        rtnstr = str(item['name']) + " was bought for " + str(item['investment']) + "$ and since then it has changed " + str(total) + "$ in value and is now worth " + str(int(total) + int(item['investment'])) + "$." 
        arr.append(rtnstr)
      a = ' '.join(arr)
      return("<Hyperchat Bot> : Here are your summaries: " + a) 
  if "compare" in message:
    if "s&p500" in message or "s&p" in message:
      truth = hasPortfolio(message, id)
      if truth != 'false':
        cursor = connection.cursor()
        arr = []
        cursor.execute("SELECT created_date, investment, id, name FROM `portal_portfolio` WHERE "
                      "'" + str(truth) + "' = name")
        for item in dictfetchall(cursor):
          a = 0
          arr.append(a)
          cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                        "buy_date, sell_date, "
                        "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                        "as gain from portal_stock where show_id=" + str(item['id']))
          for value in dictfetchall(cursor):
            a = a + int(value['gain'])
            arr[0] = a
          startdate = str(item['created_date'])[0:10]
          today = time.strftime("%Y-%m-%d")
          sp = Share('^GSPC').get_historical(startdate, today)
          gspreturn = float(sp[0]['Close']) - float(sp[len(sp)-1]['Close'])
          arr.append(str(startdate))
          arr.append(str(gspreturn))
        return("<Hyperchat Bot> : Your portfolio " + str(truth) + " since " + str(arr[1]) + " has changed " + str(arr[0]) + " in value, while the S&P500 has changed " + str(arr[2]) + "$ in value")      
      else:
        try:
          return("compare " + findCompany(message,username)[0] + " to my the s&p")
        except IndexError:
          return("<Hyperchat Bot> : Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
    elif "nasdaq" in message or "ndx" in message:
      truth = hasPortfolio(message, id)
      if truth != 'false':
        cursor = connection.cursor()
        arr = []
        cursor.execute("SELECT created_date, investment, id, name FROM `portal_portfolio` WHERE "
                      "'" + str(truth) + "' = name")
        for item in dictfetchall(cursor):
          total = 0
          arr.append(total)
          cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                        "buy_date, sell_date, "
                        "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                        "as gain from portal_stock where show_id=" + str(item['id']))
          for value in dictfetchall(cursor):
            total = total + int(value['gain'])
            arr[0] = total
          startdate = str(item['created_date'])[0:10]
          today = time.strftime("%Y-%m-%d")
          sp = Share('^IXIC').get_historical(startdate, today)
          gspreturn = float(sp[0]['Close']) - float(sp[len(sp)-1]['Close'])
          arr.append(str(startdate))
          arr.append(str(gspreturn))
          arr.append(str(total))
        return("<Hyperchat Bot> : Your portfolio " + str(truth) + " since " + str(arr[0]) + " has changed " + str(arr[2]) + " in value, while the NASDAQ has changed " + str(arr[1]) + "$ in value")      
      else:     
        try:
          return("compare " + findCompany(message,username)[0] + " to my the ndx")
        except IndexError:
          return("<Hyperchat Bot> : Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
    elif "dow" in message or "dji" in message or "dow jones" in message:
      if (hasPortfolio(message)):
        return("your portfolio " + hasPortfolio(message) + " compares well")      
      else:     
        try:
          return("compare " + findCompany(message,username)[0] + " to my the dji")
        except IndexError:
          return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
    else:
      return("get status of ports")
  elif "buy" in message and "for" in message:
    try:
      # symbol = sms_symbolexchange(findCompany(message,username)[0])
      # cursor = connection.cursor()
      # cursor.execute("SELECT buy_date FROM `portal_stock` WHERE " + str(symbol) + " = ticker ")
      return("<Hyperchat Bot> : you bought " + findCompany(message,username)[0] + " for 2.54 per share$")
    except IndexError:
      return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "top" in message or "highest performing" in message:
    return("the top stocks today are my d !")
  elif "lowest" in message or "worst" in message: 
    return("the lowest stocks today are my d !")
  elif "how" in message and "performing" in message:
    if (hasPortfolio(message, id)):
      name = str(hasPortfolio(message,id))
      arr = []
      cursor = connection.cursor()
      cursor.execute("SELECT investment, id FROM `portal_portfolio` WHERE "
                    "'" + str(id) + "' = user_id AND '" + name + "' = name ")
      for item in dictfetchall(cursor):
        total = 0
        cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                      "buy_date, sell_date, "
                      "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                      "as gain from portal_stock where show_id=" + str(item['id']))
        for value in dictfetchall(cursor):
          total = total + int(value['gain'])
          print(total)
        rtnstr = name + " was bought for " + str(item['investment']) + "$ and since then it has changed " + str(total) + "$ in value and is now worth " + str(int(total) + int(item['investment'])) + "$." 
        arr.append(rtnstr)
      a = ' '.join(arr)
      return("<Hyperchat Bot> : " + a) 
    elif (findCompany(message,username)):
      try:
        return("your stock " + findCompany(message,username)[0] + " is doing quite well")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "how" in message and "doing" in message:
    if (hasPortfolio(message, id)):
      name = str(hasPortfolio(message,id))
      arr = []
      cursor = connection.cursor()
      cursor.execute("SELECT investment, id FROM `portal_portfolio` WHERE "
                    "'" + str(id) + "' = user_id AND '" + name + "' = name ")
      for item in dictfetchall(cursor):
        total = 0
        cursor.execute("select ticker, current_price, initial_price,  number_of_shares, "
                      "buy_date, sell_date, "
                      "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                      "as gain from portal_stock where show_id=" + str(item['id']))
        for value in dictfetchall(cursor):
          total = total + int(value['gain'])
          print(total)
        rtnstr = name + " was bought for " + str(item['investment']) + "$ and since then it has changed " + str(total) + "$ in value and is now worth " + str(int(total) + int(item['investment'])) + "$." 
        arr.append(rtnstr)
      a = ' '.join(arr)
      return("<Hyperchat Bot> : " + a) 
    elif (findCompany(message,username)):
      try:
        return("your stock " + findCompany(message,username)[0] + " is doing quite well")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")       
  elif "symbol for" in message or "symbol of" in message:
    if (findCompany(message,username)):
      return("the symbol for " + findCompany(message,username)[0] + " is google !")
  elif "company name of" in message or "company name for" in message or "what company is" in message:
    if (findCompany(message,username)):
      return("the company name for " + findCompany(message,username)[0] + " is google !")
  elif "ceo of" in message or "ceo for" in message:
    if (findCompany(message,username)):
      return("the ceo of " + findCompany(message,username)[0] + " is tim cook !")
  elif "dividends" in message and "does" in message:
    if (findCompany(message,username)):
      return("the company " + findCompany(message,username)[0] + " does pay dividends!")
  elif "what" in message and "price" in message:
    if (findCompany(message,username)):
      return("the market price for the company " + findCompany(message,username)[0] + " is 2!")
  elif "gain" in message:
    if hasPortfolio(message):
      return("your gains for " + hasPortfolio(message) + " is 3$!")
    elif findCompany(message,username):
      try:
        return("your gains for " +  findCompany(message,username)[0] + " is 3$")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "losses" in message:
    if hasPortfolio(message):
      return("your losses for " + hasPortfolio(message) + " is 3$!")
    elif findCompany(message,username):
      try:
        return("your losses for " +  findCompany(message,username)[0] + " is 3$")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "rating" in message:
    if (findCompany(message,username)):
      return("the rating for the company " + findCompany(message,username)[0] + " by analysts are high!")
  elif "pe ratio" in message:
    if (findCompany(message,username)):
      return("the PE ratio for the company " + findCompany(message,username)[0] + " by analysts are high!")
  elif "beta" in message:
    if (findCompany(message,username)):
      return("the beta for the company " + findCompany(message,username)[0] + " by analysts are high!")
  else:
    return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")


def hasPortfolio(msg,id):
  print(msg)
  cursor = connection.cursor()
  cursor.execute("SELECT name FROM `portal_portfolio` WHERE '" + str(id) + "' = user_id ")
  port = ""
  for item in dictfetchall(cursor):
    print(item['name'])
    print(msg)
    if str(item['name']).lower() in msg:
      port = str(item['name'])
  if len(port) > 0:
    return item['name']
  else:
    return "false"

def findCompany(str, user):
  string = str.lower()
  string = re.sub(r'[^\w\s]','',string)
  string = ''.join([i for i in string if not i.isdigit()])  
  string = string.split()
  bank = ['?','my','how','are','you','see','can','i','whatsup','with','did','anything','is','there','should','know','to','the','what','much','will','profit','be','future','projected','budget','backtest','portfolio','unrealized','gains','buy','perform','performing','top','today','stock','stocks','about','a','into','for','who','whats','share','of','in','ceo','store','analyst','revenue','volume','day','hi','doing',"what's",'symbol','losses','dividend','company','name','ndx','dji','dow jones','nasdaq','sp','sp500','market','rating','analyst','analyze','revenue','year','compare','does','in','price','against','margin']
  bank.append(user)
  for word in bank:
    try:
      string.remove(word)
    except ValueError:
      continue
  return(string)    


def sms_symbolexchange(company):
    response = requests.get("https://s.yimg.com/aq/autoc?query="+str(company)+"&region=US&lang=en-US").json()
    company_name = response['ResultSet']['Result'][0]['symbol']
    returnString = str(company_name)
    return returnString
