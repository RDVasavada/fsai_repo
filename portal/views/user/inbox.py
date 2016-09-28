from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import get_top_portfolios, top_portfolios
from django.middleware.csrf import rotate_token
from django.db import connection
from portal.models.user.portal_user import PortalUser
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext, Context, loader

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
  if fromstatus == 'newfriend':
    cursor = connection.cursor()
    cursor.execute("SELECT username FROM portal_portaluser WHERE"
                    "'" + str(fromid) + "' = id")
    fromid = dictfetchall(cursor)
    user = []
    user.append(fromid)
    return JsonResponse({'data':user})
  else: 
    cursor = connection.cursor()
    rtnarray = []
    cursor.execute("SELECT id,to_id from portal_messageheader WHERE"
                    "'" + str(userid) + "' = from_id AND 'notfriends' = status")
    pendingInvite = dictfetchall(cursor)
    # print(pendingInvite)
    if len(pendingInvite) == 0:
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'" + str(fromid) + "' = to_id AND '" + str(userid) + "' = from_id ")
        msgs = dictfetchall(cursor)
        for msg in msgs:
          # print(msg)
          cursor.execute("SELECT content, id FROM portal_message WHERE "
                         "'" + str(msg['id']) + "' = header_id")
          returnmsg = dictfetchall(cursor)
          # print(returnmsg)
          rtnarray.append(returnmsg)
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'" + str(fromid) + "' = from_id AND'" + str(userid) + "' = to_id ")
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
                       "'" + str(fromid) + "' = to_id AND '" + str(userid) + "' = from_id ")
        msgs = dictfetchall(cursor)
        for msg in msgs:
          # print(msg)
          cursor.execute("SELECT content, id FROM portal_message WHERE "
                         "'" + str(msg['id']) + "' = header_id")
          returnmsg = dictfetchall(cursor)
          # print(returnmsg)
          rtnarray.append(returnmsg)
        cursor.execute("SELECT id FROM portal_messageheader WHERE "
                       "'" + str(fromid) + "' = from_id AND'" + str(userid) + "' = to_id ")
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
  delid = request.POST['id']
  cursor = connection.cursor()
  cursor.execute("UPDATE `portal_messageheader` SET subject "
                "= 'deleted' WHERE from_id = '" + str(user_id) + "' and id = '" + str(delid) + "'")
  msg = "deleted"
  return JsonResponse({'data':msg})  

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