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
def sent(request):
  context_dict = {}
  arr = getconnections(request)
  # print("connections")
  # print(arr)
  context_dict['friends'] = arr
  rotate_token(request)
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id
    portalUser = PortalUser.objects.get(username=username)
  else:
    print("authentication is not successful")
  context_dict["username"] = username
  t = loader.get_template('user/sent.html')
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)

@csrf_exempt
def getsent(request):
  selected = request.POST['selected']
  # print(selected)
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id  
  cursor = connection.cursor()
  cursor.execute("SELECT id FROM portal_messageheader WHERE "
                "'" + str(userid) + "' = from_id AND + '" + str(selected) + "' = to_id ")
  msgs = dictfetchall(cursor)
  rtnarray = []
  for msg in msgs:
    # print(msg['id'])
    cursor.execute("SELECT content from portal_message WHERE "
                    "'" + str(msg['id']) + "' = header_id")
    content = dictfetchall(cursor)
    try:
      rtnarray.append(content)
    except AttributeError:
      print(content)
  # print(rtnarray)
  return JsonResponse({'data':rtnarray})

@csrf_exempt
def getstarred(request):
  selected = request.POST['selected']
  # print(selected)
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id  
  cursor = connection.cursor()
  cursor.execute("SELECT to_id FROM portal_messageheader WHERE "
                "'" + str(userid) + "' = from_id AND + 'starred' = subject ")
  msgs = dictfetchall(cursor)
  rtnarray = []
  for msg in msgs:
    # print(msg['id'])
    cursor.execute("SELECT content from portal_message WHERE "
                    "'" + str(msg['to_id']) + "' = id")
    content = dictfetchall(cursor)
    try:
      rtnarray.append(content)
    except AttributeError:
      print(content)
  # print(rtnarray)
  return JsonResponse({'data':rtnarray}) 

@csrf_exempt
def getdeleted(request):
  selected = request.POST['selected']
  # print(selected)
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id  
  cursor = connection.cursor()
  cursor.execute("SELECT id FROM portal_messageheader WHERE "
                "'" + str(userid) + "' = from_id AND '" + str(selected) + "' = to_id AND 'deleted' = subject ")
  msgs = dictfetchall(cursor)
  rtnarray = []
  for msg in msgs:
    # print(msg['id'])
    cursor.execute("SELECT content from portal_message WHERE "
                    "'" + str(msg['id']) + "' = header_id")
    content = dictfetchall(cursor)
    try:
      rtnarray.append(content)
    except AttributeError:
      print(content)
  # print(rtnarray)
  return JsonResponse({'data':rtnarray})  


@csrf_exempt
def accept(request):
  acceptid = request.POST['acceptid']
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    yours = portalUser.connections
    user_id = request.user.id
    yours = str(yours) + "," + str(acceptid)
    cursor = connection.cursor()
    cursor.execute("UPDATE portal_messageheader SET status "
                    " = 'friends' WHERE from_id = '" + str(acceptid) + "' AND to_id = '" + str(user_id) + "'")
    cursor.execute("UPDATE portal_portaluser SET connections "
                    " = '" + str(yours) + "' WHERE id = '" + str(user_id) + "'")
    cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES "
                   "('" + str(user_id) + "','" + str(acceptid) + "','newfriend','2012-11-25 00:00:00','friends');")
    cursor.execute("SELECT LAST_INSERT_ID();")
    header_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']    
    cursor.execute("INSERT INTO `portal_message` (header_id, is_from_sender, content) VALUES "
                     "(" + str(header_id) + ",'" + str(user_id) + "','newfriend');")
    cursor.close()
    connection.close()                           
    return JsonResponse({'data':str(acceptid)})
  else:
    return JsonResponse({'data':'fail'})

@csrf_exempt
def getmsg(request):
  if request.user.is_authenticated():
    username = request.user.username
    userid = request.user.id
  fromstatus = request.GET['status']
  fromid = request.GET['selected']
#any new incoming friend requests?  
  if fromstatus == 'newfriend':
    cursor = connection.cursor()
    cursor.execute("SELECT username FROM portal_portaluser WHERE"
                    "'" + str(fromid) + "' = id")
    fromid = dictfetchall(cursor)
    user = []
    user.append(fromid)
    return JsonResponse({'data':user})
#if no new friend requests:
  else: 
    cursor = connection.cursor()
    rtnarray = []
#any sent friend requests?
    cursor.execute("SELECT id,to_id from portal_messageheader WHERE"
                    "'" + str(userid) + "' = from_id AND 'notfriends' = status")
    pendingInvite = dictfetchall(cursor)
#if none:
    if len(pendingInvite) == 0:
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'deleted' != subject AND'" + str(fromid) + "' = to_id AND '" + str(userid) + "' = from_id")
        msgs = dictfetchall(cursor)
        for msg in msgs:
          # print(msg)
          cursor.execute("SELECT content, id FROM portal_message WHERE "
                         "'" + str(msg['id']) + "' = header_id")
          returnmsg = dictfetchall(cursor)
          # print(returnmsg)
          rtnarray.append(returnmsg)
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'deleted' != subject AND '" + str(fromid) + "' = from_id AND '" + str(userid) + "' = to_id")
        msgs = dictfetchall(cursor)
        for msg in msgs:
          # print(msg)
          cursor.execute("SELECT content, id FROM portal_message WHERE "
                         "'" + str(msg['id']) + "' = header_id")
          returnmsg = dictfetchall(cursor)
          # print(returnmsg)
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
#if you do have pending friend requests:
    else:
      for invite in pendingInvite:
        if str(invite['to_id']) == str(fromid):
          cursor = connection.cursor()
          cursor.execute("SELECT content,id from portal_message WHERE "
                       "'" + str(invite['id']) + "' = header_id")
          contents = dictfetchall(cursor)
          if contents[0]['content'] == 'blank':
            rtnarray.append(contents[0]['content'])
      if len(rtnarray) == 0:
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'unread' = subject AND '" + str(fromid) + "' = to_id AND '" + str(userid) + "' = from_id ")
        msgs = dictfetchall(cursor)
        for msg in msgs:
          # print(msg)
          cursor.execute("SELECT content, id FROM portal_message WHERE "
                         "'" + str(msg['id']) + "' = header_id")
          returnmsg = dictfetchall(cursor)
          # print(returnmsg)
          rtnarray.append(returnmsg)
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'unread' = subject AND '" + str(fromid) + "' = from_id AND'" + str(userid) + "' = to_id ")
        msgs = dictfetchall(cursor)
        for msg in msgs:
          cursor.execute("SELECT content,id FROM portal_message WHERE "
                         "'" + str(msg['id']) + "' = header_id")
          returnmsg = dictfetchall(cursor)
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
        # print(newArr)
        return JsonResponse({'data':newArr})            
      return JsonResponse({'data':rtnarray})

    #   else:
    #     cursor.execute("SELECT id FROM portal_messageheader WHERE "
    #                    "'" + str(userid) + "' = from_id OR '" + str(userid) + "' = to_id "
    #                   "AND '" + str(fromid) + "' = to_id OR '" + str(fromid) + "' = from_id")
    #     msgs = dictfetchall(cursor)
    #     if len(msgs) == 1:
    #       cursor.execute("SELECT subject FROM portal_messageheader WHERE"
    #                     "'" + str(userid) + "' = to_id AND '" + str(fromid) + "' = from_id")
    #       newfriend = dictfetchall(cursor)
    #       for friend in newfriend:
    #         print(friend)
    #         rtnarray.append(friend)
    #     for msg in msgs:
    #       cursor.execute("SELECT content FROM portal_message WHERE "
    #                      "'" + str(msg['id']) + "' = header_id")
    #       returnmsg = dictfetchall(cursor)
    #       print(returnmsg)
    #       rtnarray.append(returnmsg)
    #     return JsonResponse({'data':rtnarray})    
          
            
    #   print(fromid)
    #   if invite['id'] == str(fromid):
    #     print("gotcha")
    #   else:

@csrf_exempt
def sendmsg(request):
  context_dict = {}
  if request.user.is_authenticated():
    username = request.user.username
    portId = request.user.id
    # print("Authenticated User is :" + username)
    portalUser = PortalUser.objects.get(username=username)
    # print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))
    # print("getting all the portfolios")
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
  cursor = connection.cursor()
  cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES"
                 "('" + str(portId) + "','" + str(recipient) + "','unread','2016-07-09 12:11:25','friends');")
  cursor.execute("SELECT LAST_INSERT_ID();")
  header_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
  cursor.execute("INSERT INTO `portal_message` (header_id, is_from_sender, content) VALUES "
                 "('" + str(header_id) + "','" + str(portId) + "','" + str(message) + "');")
  if recipient == '0':
    botmsg = analyze(message, portId, username)
    cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES"
                     "('0','" + str(portId) + "','unread','2016-07-09 12:11:25','friends');")  
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
    connections = portalUser.connections
    connections = connections.split(',')
    arr = []
    for user in connections:
      cursor = connection.cursor()
      cursor.execute("SELECT username, id FROM portal_portaluser WHERE "
                      "" + str(user) + " = id")
      user = dictfetchall(cursor)
      # print(user)
      try:
        arr.append({
          'username' : user[0]['username'],
          'id': user[0]['id'],
          'status': 'friends',
        })
      except IndexError:
        print(user)
    cursor.execute("SELECT status, from_id FROM portal_messageheader WHERE "
                   "'" + str(userid) + "' = to_id AND 'notfriends'  = status")
    newfriends = dictfetchall(cursor)
    for friend in newfriends:
      cursor.execute("SELECT username FROM portal_portaluser WHERE"
                    "'" + str(newfriends[0]['from_id']) + "' = id")
      user = dictfetchall(cursor)
      arr.append({
        'username' : user[0]['username'],
        'id'  : newfriends[0]['from_id'] ,
        'status'  : 'New Friend Request',
      })
    # try: 
    # except IndexError: 
  # print(arr)    
  return JsonResponse({'data':arr})
# def getmessages(request):

# def getheaders(request):

@csrf_exempt
def addconnection(request):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    yours = portalUser.connections
    user_id = request.user.id
  query = request.POST['query']
  connections = searchuser(query)
  # print(len(connections))
  if len(connections) == 0:
    return JsonResponse({'data':'0'})
  else:
    for u in connections:
      yours = str(yours) + "," + str(u.id)
      cursor = connection.cursor()
      cursor.execute("UPDATE portal_portaluser SET connections "
                      " = '" + str(yours) + "' WHERE id = '" + str(user_id) + "'")
      cursor = connection.cursor()
      cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES"
                     "('" + str(user_id) + "','" + str(u.id) + "','friends','12:11:25','notfriends');")
      cursor.execute("SELECT LAST_INSERT_ID();")
      header_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
      cursor.execute("INSERT INTO `portal_message` (header_id, is_from_sender, content) VALUES "
                       "('" + str(header_id) + "','" + str(user_id) + "','blank');")
      addusername = u.username
      return JsonResponse({'data':addusername})

@csrf_exempt
def starmsg(request):
  if request.user.is_authenticated():
    username = request.user.username
    portalUser = PortalUser.objects.get(username=username)
    yours = portalUser.connections
    user_id = request.user.id  
  msgid = request.POST['id']
  cursor = connection.cursor()
  cursor.execute("SELECT status from portal_messageheader WHERE "
                  "to_id = '" +str(msgid) + "' AND subject = 'starred'")
  stars = dictfetchall(cursor)
  if len(stars) == 0:
    cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES"
                  "('" + str(user_id) + "','" + str(msgid) + "','starred', '12:11:25','friends');")
    return JsonResponse({'data':'star'})
  else:
    cursor.execute("DELETE FROM portal_messageheader WHERE"
                    " from_id = '" + str(user_id) + "' AND to_id = '" + str(msgid) + "' AND subject = 'starred'")
    JsonResponse({'data':'unstar'})
  msg = "star"
  return JsonResponse({'data':msg})

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
    return("<Hyperchat Bot> : Hey How you doin. I can carry out basic commands for you via SMS, or chat. Text me at 000000! Some things I can do: provide updates on your portfolios, provide information about stocks, and companies.")
  elif "what is this website" in message:
    return("<Hyperchat Bot> : Vise is an online robo-advisement platform for the masses.")
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
        today = time.strftime("%Y-%m-%d")
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
    if (hasPortfolio(message)):
      return("your portfolio " + hasPortfolio(message) + " is doing well!")
    elif (findCompany(message,username)):
      try:
        return("your stock " + findCompany(message,username)[0] + " is doing quite well")
      except IndexError:
        return("Sorry, I didn't recognize that request. I've told my creator about this and he will be working on it!")
  elif "how" in message and "doing" in message:
    if (hasPortfolio(message)):
      return("your portfolio " + hasPortfolio(message) + " is doing well!")
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
