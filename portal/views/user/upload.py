from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
import time
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.http import JsonResponse
from portal.models.user.portal_user import PortalUser
from portal.models.user.UploadFile import UploadFile
from portal.services.forms import UploadFileForm
import os
from django.conf import settings
import base64

@login_required
def upload(request):
    # Handle file upload
    if request.method == 'POST':
        print(request.FILES['docfile'])
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = UploadFile(docfile = request.FILES['docfile'])
            newdoc.save()
            thisTime = time.strftime("%Y/%m/%d")
            url = '/media/documents/' + str(thisTime) + '/' + str(request.FILES['docfile'])
            url = (url.replace(" ","_"))
            if request.user.is_authenticated():
                userid = request.user.id
            cursor = connection.cursor()
            cursor.execute("UPDATE portal_portaluser SET picture_url "
                            " = '" + str(url) + "' WHERE id = '" + str(userid) + "'")
            cursor.close()
            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('portal.views.cropload'))
    else:
        form = UploadFileForm() # A empty, unbound form
        if request.user.is_authenticated(): 
          username = request.user.username
          portalUser = PortalUser.objects.get(username=username)
          picture_url = portalUser.picture_url

    # Load documents for the list page
    # documents = UploadFile.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'user/list.html',
        {'form': form, 'picture_url': picture_url },
        context_instance=RequestContext(request)
    )

@csrf_exempt
@login_required
def cropload(request):
    # Handle file upload
    if request.method == 'POST':
        imgData = request.POST['data'][22:]
        imgData = bytes(imgData)
        print(imgData)
        imgUrl = request.POST['url'][7:]
        with open(os.path.join(settings.MEDIA_ROOT, imgUrl), "wb") as fh:
            fh.write(base64.decodestring(imgData))
        print(fh)
        return JsonResponse({'data':'asdf'})
        # print(request.FILES['docfile'])
        # form = UploadFileForm(request.POST, request.FILES)
        # if form.is_valid():
        #     newdoc = UploadFile(docfile = request.FILES['docfile'])
        #     newdoc.save()
        #     thisTime = time.strftime("%Y/%m/%d")
        #     url = '/media/documents/' + str(thisTime) + '/' + str(request.FILES['docfile'])
        #     url = (url.replace(" ","_"))
        #     if request.user.is_authenticated():
        #         userid = request.user.id
        #     cursor = connection.cursor()
        #     cursor.execute("UPDATE portal_portaluser SET picture_url "
        #                     " = '" + str(url) + "' WHERE id = '" + str(userid) + "'")
        #     cursor.close()
        #     # Redirect to the document list after POST
        #     return HttpResponseRedirect(reverse('portal.views.cropload'))
    else:
        form = UploadFileForm() # A empty, unbound form
        if request.user.is_authenticated():
          username = request.user.username
          portalUser = PortalUser.objects.get(username=username)
          picture_url = portalUser.picture_url

    # Load documents for the list page
    # documents = UploadFile.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'user/croplist.html',
        {'form': form, 'picture_url': picture_url },
        context_instance=RequestContext(request)
    )