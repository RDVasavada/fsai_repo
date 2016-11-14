import smtplib
from datetime import datetime, timedelta
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import logout, authenticate, login
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from portal.services import EmailService
from django.http import JsonResponse
from portal.models.user.portal_user import PortalUser
from django.contrib.auth.models import User
from django.conf import settings
from django.db import connection
from portal.utils import TokenGenerator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext

def main(request):
    return render(request, 'public/splash.html')

def splash(request):
    # return render(request, 'user/dashboard.html')
    return HttpResponseRedirect('/user/dashboard')

def logoutview(request):
    ''' Logout the current user '''
    logout(request)
    return HttpResponseRedirect('/login')

def loginview(request):
    if request.method == 'GET':
        error = request.GET.get('error', None)
        errors = []
        if error is not None:
            errors = [error]
        return render(request, 'public/login.html', { 'errors': errors })
    else:
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        errors = []

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                # Redirect to a success page.
                return HttpResponseRedirect('/user/dashboard')
            else:
                errors.append('This account is disabled, please contact us @ 555-555-5555')
        else:
            errors.append('Invalid username or password')

        return render(request, 'public/login.html', { 'errors': errors })

@csrf_exempt
def username_exist(request, username):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM portal_portaluser WHERE username = \'" + str(username) + "\'")
    nameL = 0
    for item in dictfetchall(cursor):
        nameL += 1
    if nameL == 0 : 
        return(JsonResponse({'exist':0}))
    else:
        return(JsonResponse({'exist':1}))

@csrf_exempt
def email_exist(request, email):
    print(email)
    # return(JsonResponse({'exist':0}))
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM portal_portaluser WHERE email = \'" + str(email) + "\'")
    nameL = 0
    for item in dictfetchall(cursor):
        nameL += 1
    if nameL == 0 : 
        return(JsonResponse({'exist':0}))
    else:
        return(JsonResponse({'exist':1}))


def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    


def register(request):
    if request.method == 'GET':
        return render(request, 'public/login.html')
    else:
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        password_repeat = request.POST.get('password_repeat')
        phone = request.POST.get('phone', None)
        email = request.POST.get('email', None)
        address = request.POST.get('address', None)
        reason = request.POST.get('reason', None)
        picture_url = "/static/img/profile.svg"
        connections = 0
        confirm_email = 0
        confirm_phone = 0
        pin_number = 1111
        errors = []

        if password == password_repeat:
            if len(password) > 8:

                new_user = PortalUser.objects.create_user(username=username, email=email, password=password, connections=0, picture_url=picture_url, confirm_email = confirm_email, confirm_phone = confirm_phone, pin_number = pin_number)

                new_user.phone=phone
                new_user.email=email
                new_user.address=address
                new_user.reason=reason

                try:
                    new_user.save()
                    toid = new_user.id
                    cursor = connection.cursor()
                    cursor.execute("INSERT INTO `portal_messageheader` (from_id, to_id, subject, time, status) VALUES "
                                "('0','" + str(toid) + "','unread','2012-11-25 00:00:00','unread')")
                    cursor.execute("SELECT LAST_INSERT_ID();")
                    header_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']    
                    cursor.execute("INSERT INTO `portal_message` (header_id, is_from_sender, content) VALUES "
                                "('" + str(header_id) + "','0','<Hyperchat Bot> : Hi there! Welcome to Vise! Im a simple bot who can answer your questions and carry out simple commands for you. Nice to meet you. Why dont you try creating a portfolio to try things out?')")
                    user = authenticate(username=username, password=password)
                    login(request, user)
                    return HttpResponseRedirect('/')
                except Exception as e:
                    #This user must already exist
                    print("already")
                    print e
            else:
                errors.append('Passwords must 9 or more charecters')
        else:
            errors.append('Password and Password Repeat don\'t match')
        return render(request, 'public/register.html', {'errors':errors})

def recover_password(request):
    if request.method == 'GET':
        return render(request, 'public/recover_password.html')
    else:
        userEmail = request.POST.get('email', None)

        emailService = EmailService(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_USERNAME, settings.EMAIL_HOST_PASSWORD)

        #generate
        token = TokenGenerator.create_random_token(8)
        user = PortalUser.objects.filter(email=userEmail).first()

        if user is not None:
            user.resetToken = token
            user.tokenCreateDate = datetime.now()
            emailService.send(userEmail, token, user.username)
            user.save()
            return render(request, 'public/email_sent.html')

    return render(request, 'public/recover_password.html')

def new_password(request, token):
    if request.method == "GET":
        user = PortalUser.objects.filter(resetToken=token).first()
        if user is not None:
            if user.tokenCreateDate < datetime.now()-timedelta(hours=4):
                return HttpResponseRedirect('/login?error=Your%20email%20token%20has%20expired.%20Please%20restart%20the%20process.')
        else:
            return HttpResponseRedirect('/login?error=Invalid%20token.')
        return render(request, 'public/new_password.html', {'token':token})
    else:
        errors = []
        user = PortalUser.objects.filter(resetToken=token).first()

        if user is not None:
            password = request.POST.get("password", None)
            passwordConfirm = request.POST.get("passwordConfirm", None)

            if password == passwordConfirm and len(password) > 8:
                user.set_password(password)
                user.save()

                return HttpResponseRedirect('/login')

            else:
                errors.append("Passwords don\'t match")
                return render(request, 'public/new_password.html', {'errors':errors})

def email_sent(request):
    if request.method == "GET":
        return render(request, 'public/email_sent.html')
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ] 
