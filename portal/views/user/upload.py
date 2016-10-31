from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

from portal.models.user.UploadFile import UploadFile
from portal.services.forms import UploadFileForm

def upload(request):
    # Handle file upload
    if request.method == 'POST':
        print(request.FILES['docfile'])
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = UploadFile(docfile = request.FILES['docfile'])
            newdoc.save()
            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('portal.views.upload'))
    else:
        form = UploadFileForm() # A empty, unbound form

    # Load documents for the list page
    # documents = UploadFile.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'user/list.html',
        {'form': form},
        context_instance=RequestContext(request)
    )
