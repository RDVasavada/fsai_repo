from django.contrib import admin
from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = patterns('',

    #login
    url(r'^', include('portal.config.urls')),

    #Admin urls
	url(r'^sa/', include(admin.site.urls)),

    #Socket io
    # url("", include('django_socketio.urls')),

)

urlpatterns += staticfiles_urlpatterns()

handler404 = 'portal.views.handle_404'
handler500 = 'portal.views.handle_500'
handler403 = 'portal.views.handle_403'
